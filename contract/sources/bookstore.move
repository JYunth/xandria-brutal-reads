module bookstore_addr::bookstore {

    // ================================= Imports ================================= //
    // Removed unused: account, coin::Coin, signer, string_utils::to_string, option::Option
    use aptos_framework::coin::{Self};
    use aptos_framework::event;
    use aptos_framework::object::{Self, Object, ExtendRef, ConstructorRef, TransferRef}; // Added TransferRef
    use aptos_framework::timestamp;
    use aptos_token_objects::collection;
    use aptos_token_objects::token::{Self, Token, BurnRef, MutatorRef};
    use std::error;
    use std::option::{Self};
    use std::signer::address_of;
    use std::string::{Self, String};
    use std::vector; // Added vector import

    // ================================= Error Codes ================================= //
    const EBOOK_NOT_FOUND: u64 = 1;
    const EINSUFFICIENT_FUNDS: u64 = 2;
    const EUSER_DATA_ALREADY_EXISTS: u64 = 3;
    const EUSER_DATA_NOT_FOUND: u64 = 4;
    const ENOT_ADMIN: u64 = 5;
    const EBOOK_NOT_FOR_SALE: u64 = 6;
    const EBOOK_ALREADY_OWNED: u64 = 7;
    const ECOLLECTION_ALREADY_EXISTS: u64 = 8; // Added for init_module safety

    // ================================= Constants ================================= //
    const BOOKSTORE_OBJECT_SEED: vector<u8> = b"XANDRIA_BOOKSTORE";
    const BOOKSTORE_COLLECTION_NAME: vector<u8> = b"Xandria Bookstore Collection";
    const BOOKSTORE_COLLECTION_DESCRIPTION: vector<u8> = b"Collectibles from the Xandria Bookstore";
    const BOOKSTORE_COLLECTION_URI: vector<u8> = b"https://example.com/bookstore_collection.png"; // Placeholder URI
    const BOOK_TOKEN_URI: vector<u8> = b"https://example.com/book_token.png"; // Placeholder URI

    // ================================= Struct Definitions ================================= //

    /// Simple struct to hold personalized user data. Stored under the user's account.
    struct UserData has key, store {
        username: String,
        registration_date: u64,
    }

    /// Details of a specific book.
    struct BookDetails has copy, drop, store {
        title: String,
        author_name: String,
        description: String,
        content_uri: String, // URI pointing to the actual book content (e.g., IPFS)
    }

    /// The core Book NFT resource. Holds details, price, and token refs.
    /// Stored under the token object's address.
    struct BookNFT has key {
        details: BookDetails,
        price: u64, // Price in APT (smallest unit, e.g., Octas)
        mutator_ref: MutatorRef,
        burn_ref: BurnRef,
        transfer_ref: TransferRef, // Added TransferRef
    }

    /// Resource holding the extend_ref for the contract's object signer.
    /// Allows the contract to manage the collection and tokens programmatically.
    /// Resource holding the extend_ref for the contract's object signer.
    /// Allows the contract to manage the collection and tokens programmatically.
    /// Stored under the contract object's address.
    struct ObjectController has key {
        app_extend_ref: ExtendRef,
        // admin_address field removed - we use @bookstore_addr directly
    }

    /// Resource holding the list of all published book token addresses.
    /// Stored under the contract's object address.
    struct BookstoreInventory has key {
        book_token_addresses: vector<address>,
    }

    // ================================= Events ================================= //

    #[event]
    struct UserDataStored has drop, store {
        user_address: address,
        username: String,
    }

    #[event]
    struct BookPublished has drop, store {
        token_address: address,
        title: String,
        author_name: String,
        price: u64,
    }

    #[event]
    struct BookPurchased has drop, store {
        token_address: address,
        buyer_address: address,
        seller_address: address, // Should be the admin/contract address in this flow
        price: u64,
    }

    // ================================= Initialization ================================= //

    /// Called once when the module is published.
    /// Sets up the ObjectController and the global bookstore collection.
    fun init_module(deployer: &signer) { // Renamed admin_account to deployer for clarity
        // let admin_addr = address_of(deployer); // No longer needed directly here

        // Create the named object for the bookstore contract itself using the deployer account
        let constructor_ref = object::create_named_object(
            deployer, // Use the deployer signer to create the contract object
            BOOKSTORE_OBJECT_SEED,
        );

        // Generate the extend ref needed to manage objects created by this contract
        let extend_ref = object::generate_extend_ref(&constructor_ref);
        let contract_object_signer = object::generate_signer(&constructor_ref); // Get the signer for the contract object

        // Store the ObjectController (with only extend_ref) under the contract object's address
        move_to(&contract_object_signer, ObjectController {
            app_extend_ref: extend_ref,
        });

        // Create the collection using the contract object's signer
        create_global_bookstore_collection(&contract_object_signer);

        // Initialize the inventory using the contract object's signer
        move_to(&contract_object_signer, BookstoreInventory {
            book_token_addresses: vector::empty<address>(),
        });
    }

    // ================================= Helper Functions ================================= //

    /// Get the address of the contract's named object.
    fun get_contract_object_address(): address {
        object::create_object_address(&@bookstore_addr, BOOKSTORE_OBJECT_SEED)
    }

    /// Get the signer for the contract's named object. Requires ObjectController exists.
    fun get_contract_signer(): signer acquires ObjectController {
        let controller = borrow_global<ObjectController>(get_contract_object_address());
        object::generate_signer_for_extending(&controller.app_extend_ref)
    }

    // Removed get_admin_address() helper function

    /// Creates the global collection owned by the contract.
    fun create_global_bookstore_collection(creator: &signer) {
        let description = string::utf8(BOOKSTORE_COLLECTION_DESCRIPTION);
        let name = string::utf8(BOOKSTORE_COLLECTION_NAME);
       let uri = string::utf8(BOOKSTORE_COLLECTION_URI);

        // Create an unlimited collection (no max supply constraint at collection level)
        collection::create_unlimited_collection(
            creator,
            description,
            name,
            option::none(), // No royalty specified
            uri,
        );
    }
    #[view]
    /// Get the address of the global bookstore collection object.
    public fun get_bookstore_collection_address(): address {
        let collection_name = string::utf8(BOOKSTORE_COLLECTION_NAME);
        // The collection is created by the contract's object signer
        let creator_addr = get_contract_object_address();
        collection::create_collection_address(&creator_addr, &collection_name)
    }

    /// Get the address for a specific book token based on its title (used as seed).
    /// NOTE: This assumes titles are unique enough for the demo. A real app might use a counter or UUID.
    fun create_book_token_address(title: &String): address {
        let collection_name = string::utf8(BOOKSTORE_COLLECTION_NAME);
        let creator_addr = get_contract_object_address();
        // Using title as the token creation seed - ensure uniqueness for the demo!
        token::create_token_address(
            &creator_addr,
            &collection_name,
            title, // Using title as the unique seed for the token name
        )
    }

    // ============================ Onboarding Function ============================ //

    /// Stores personalized data for a user. Fails if data already exists.
    public entry fun store_user_data(user: &signer, username: String) {
        let user_addr = address_of(user);
        assert!(!exists<UserData>(user_addr), error::already_exists(EUSER_DATA_ALREADY_EXISTS));

        let user_data = UserData {
            username: username,
            registration_date: timestamp::now_seconds(),
        };
        move_to(user, user_data);

        event::emit(UserDataStored {
            user_address: user_addr,
            username: username,
        });
    }

    // ============================ Admin/Setup Function ============================ //

    /// Publishes a new book NFT for sale. Only callable by the admin.
    public entry fun publish_book_for_sale(
        admin: &signer,
        title: String,
        author_name: String,
        description: String,
        content_uri: String,
        price: u64, // Price in Octas (1 APT = 10^8 Octas)
    ) acquires BookstoreInventory, ObjectController { // ObjectController needed for get_contract_signer
        // Verify caller is the admin by comparing with the named address
        let signer_addr = address_of(admin);
        assert!(signer_addr == @bookstore_addr, error::permission_denied(ENOT_ADMIN));

        // Get the contract object's signer using the ObjectController stored under the contract object address
        let contract_signer = get_contract_signer(); // This still correctly gets the signer for the contract object
        let collection_name = string::utf8(BOOKSTORE_COLLECTION_NAME);
        let token_uri = string::utf8(BOOK_TOKEN_URI); // Use generic token URI for now
        let token_description = string::utf8(b"A unique book NFT from Xandria Bookstore"); // Generic description

        // Create the token object using the title as the unique name/seed
        // Fails if a token with this exact title already exists in the collection
        let constructor_ref: ConstructorRef = token::create_named_token(
            &contract_signer,
            collection_name,
            token_description, // Use a generic description for the token object itself
            title, // Use title as the unique token name within the collection
            option::none(), // No royalty for the token object
            token_uri, // Use a generic URI for the token object
        );

        // Generate necessary refs for the token
        let token_signer = object::generate_signer(&constructor_ref);
        let mutator_ref = token::generate_mutator_ref(&constructor_ref);
        let burn_ref = token::generate_burn_ref(&constructor_ref);
        let transfer_ref = object::generate_transfer_ref(&constructor_ref); // Generate TransferRef

        // Create the BookNFT resource containing specific details and price
        let book_details = BookDetails {
            title: title,
            author_name: author_name,
            description: description,
            content_uri: content_uri,
        };

        let book_nft_data = BookNFT {
            details: book_details,
            price: price,
            mutator_ref: mutator_ref,
            burn_ref: burn_ref,
            transfer_ref: transfer_ref, // Store the TransferRef
        };

        // Store the BookNFT resource under the token object's address
        move_to(&token_signer, book_nft_data);

        // The token is initially owned by the contract signer (admin's controlled object)
        // No transfer needed here.

        // Add the new book token address to the inventory
        let inventory = borrow_global_mut<BookstoreInventory>(get_contract_object_address());
        vector::push_back(&mut inventory.book_token_addresses, address_of(&token_signer));

        event::emit(BookPublished {
            token_address: address_of(&token_signer),
            title: title,
            author_name: author_name,
            price: price,
        });
    }

    // ============================ Marketplace Function ============================ //

    /// Allows a user to buy a book NFT listed for sale by the admin/contract.
    public entry fun buy_book(
        buyer: &signer,
        book_token_address: address // The address of the specific book token object to buy
    ) acquires BookNFT { // Removed ObjectController
        let buyer_addr = address_of(buyer);
        let contract_addr = get_contract_object_address(); // Address of the contract's controlling object (still needed for ownership check)

        // --- Verification ---
        // 1. Check if the BookNFT resource exists at the given address
        assert!(exists<BookNFT>(book_token_address), error::not_found(EBOOK_NOT_FOUND));

        // 2. Check if the token object itself exists and is owned by the contract/admin
        let token_object: Object<Token> = object::address_to_object(book_token_address);
        assert!(object::owner(token_object) == contract_addr, error::permission_denied(EBOOK_ALREADY_OWNED)); // Ensure it's still owned by contract

        // --- Payment ---
        let book_nft_data = borrow_global<BookNFT>(book_token_address);
        let price = book_nft_data.price;

        // Transfer APT from buyer to the contract's named admin address (@bookstore_addr)
        coin::transfer<aptos_framework::aptos_coin::AptosCoin>(buyer, @bookstore_addr, price);
        // Note: This will fail if the buyer doesn't have enough APT or if @bookstore_addr hasn't registered AptosCoin

        // --- NFT Transfer ---
        // Transfer the token object from the contract signer to the buyer
        // We need the TransferRef which was generated during token creation but not stored.
        // Re-generating it requires the ConstructorRef, which is temporary.
        // SOLUTION: Use object::transfer_with_ref using the stored TransferRef.
        // Need mutable borrow to consume the ref.
        let book_nft_data_mut = borrow_global_mut<BookNFT>(book_token_address);
        // Note: transfer_with_ref consumes the ref, making the NFT non-transferable afterwards by this mechanism.
        // If multiple transfers are needed, the ref would need to be regenerated or a different pattern used.
        // For this demo flow (buy once), consuming the ref is acceptable.
        // Generate a linear (consumable) ref from the stored ref
        let linear_transfer_ref = object::generate_linear_transfer_ref(&book_nft_data_mut.transfer_ref);
        // Use the linear ref and recipient address (2 arguments)
        object::transfer_with_ref(linear_transfer_ref, buyer_addr);


        // --- Event ---
        event::emit(BookPurchased {
            token_address: book_token_address,
            buyer_address: buyer_addr,
            seller_address: contract_addr, // The contract object was the effective seller
            price: price,
        });
    }


    // ================================= View Functions ================================== //

    #[view]
    /// Returns the stored username for a given user address.
    public fun get_user_data(user_addr: address): String acquires UserData {
        assert!(exists<UserData>(user_addr), error::not_found(EUSER_DATA_NOT_FOUND));
        borrow_global<UserData>(user_addr).username
    }
    #[view]
    /// Returns the details and price of a specific book NFT.
    public fun get_book(book_token_address: address): (BookDetails, u64) acquires BookNFT {
        assert!(exists<BookNFT>(book_token_address), error::not_found(EBOOK_NOT_FOUND));
        let book_nft_data = borrow_global<BookNFT>(book_token_address);
        (book_nft_data.details, book_nft_data.price)
    }
    // NOTE: Listing available books for sale would typically be done off-chain
    // by querying events or indexing the global collection's tokens
    // and checking their owner and BookNFT resource data.

    #[view]
    /// Returns the list of all published book token addresses.
    public fun get_published_book_addresses(): vector<address> acquires BookstoreInventory {
        borrow_global<BookstoreInventory>(get_contract_object_address()).book_token_addresses
    }

    // Removed get_stored_admin_address() view function

    // ================================= Unit Tests ================================== //
    #[test_only]
    use aptos_framework::account; // Re-added for test functions
    // Removed managed_coin and capability imports
    #[test_only]
    use aptos_framework::aptos_coin::AptosCoin;

    #[test_only]
    const TEST_USERNAME: vector<u8> = b"Test User";
    #[test_only]
    const TEST_BOOK_TITLE: vector<u8> = b"The Move Book";
    #[test_only]
    const TEST_AUTHOR: vector<u8> = b"Aptos Dev";
    #[test_only]
    const TEST_DESC: vector<u8> = b"A comprehensive guide.";
    #[test_only]
    const TEST_URI: vector<u8> = b"ipfs://example_uri";
    #[test_only]
    const TEST_PRICE: u64 = 1 * 100_000_000; // 1 APT

    #[test_only]
    fun setup_test(aptos: &signer, admin: &signer, user: &signer) {
        account::create_account_for_test(address_of(admin));
        account::create_account_for_test(address_of(user));

        // Fund accounts for testing coin transfers
        coin::register<AptosCoin>(admin);
        coin::register<AptosCoin>(user);
        // Mint some APT to admin and user (using aptos framework account as source)
        let admin_addr = address_of(admin);
        let user_addr = address_of(user);
        // Reverted back to standard coin::mint with aptos signer
        coin::mint<AptosCoin>(aptos, admin_addr, 10 * 100_000_000); // 10 APT
        coin::mint<AptosCoin>(aptos, user_addr, 5 * 100_000_000);  // 5 APT


        timestamp::set_time_has_started_for_testing(aptos);
        // Initialize the module using the admin account
        init_module(admin);
    }

    #[test(aptos = @0x1, admin = @bookstore_addr, user = @0x123)]
    fun test_onboarding_and_get_data(aptos: &signer, admin: &signer, user: &signer) acquires UserData {
        setup_test(aptos, admin, user);
        let username = string::utf8(TEST_USERNAME);
        store_user_data(user, username);

        let stored_username = get_user_data(address_of(user));
        assert!(stored_username == username, 1);
    }

    #[test(aptos = @0x1, admin = @bookstore_addr, user = @0x123)]
    #[expected_failure(abort_code = 3, location = bookstore_addr::bookstore)] // EUSER_DATA_ALREADY_EXISTS
    fun test_onboarding_twice_fails(aptos: &signer, admin: &signer, user: &signer) {
        setup_test(aptos, admin, user);
        let username = string::utf8(TEST_USERNAME);
        store_user_data(user, username);
        // Try storing again
        store_user_data(user, username);
    }

    #[test(aptos = @0x1, admin = @bookstore_addr, user = @0x123)]
    // Note: Tests implicitly use @bookstore_addr as the admin due to the test setup
    fun test_publish_and_get_book(aptos: &signer, admin: &signer, user: &signer) acquires BookNFT, BookstoreInventory, ObjectController { // ObjectController needed by setup_test->init_module
        setup_test(aptos, admin, user);
        let title = string::utf8(TEST_BOOK_TITLE);
        let author = string::utf8(TEST_AUTHOR);
        let desc = string::utf8(TEST_DESC);
        let uri = string::utf8(TEST_URI);

        publish_book_for_sale(admin, title, author, desc, uri, TEST_PRICE);

        let token_addr = create_book_token_address(&title);
        assert!(exists<BookNFT>(token_addr), 2);

        let (details, price) = get_book(token_addr);
        assert!(details.title == title, 3);
        assert!(details.author_name == author, 4);
        assert!(details.description == desc, 5);
        assert!(details.content_uri == uri, 6);
        assert!(price == TEST_PRICE, 7);
    }

     #[test(aptos = @0x1, admin = @bookstore_addr, user = @0x123)]
     #[expected_failure(abort_code = 5, location = bookstore_addr::bookstore)] // ENOT_ADMIN
     fun test_publish_not_admin_fails(aptos: &signer, admin: &signer, user: &signer) acquires BookstoreInventory, ObjectController { // Added acquires needed by publish_book_for_sale
         setup_test(aptos, admin, user);
         let title = string::utf8(TEST_BOOK_TITLE);
         let author = string::utf8(TEST_AUTHOR);
         let desc = string::utf8(TEST_DESC);
         let uri = string::utf8(TEST_URI);

         // User tries to publish
         publish_book_for_sale(user, title, author, desc, uri, TEST_PRICE);
     }

    #[test(aptos = @0x1, admin = @bookstore_addr, user = @0x123)]
    fun test_buy_book(aptos: &signer, admin: &signer, user: &signer) acquires BookNFT, BookstoreInventory, ObjectController { // Adjusted acquires
        setup_test(aptos, admin, user);
        let title = string::utf8(TEST_BOOK_TITLE);
        let author = string::utf8(TEST_AUTHOR);
        let desc = string::utf8(TEST_DESC);
        let uri = string::utf8(TEST_URI);
        let user_addr = address_of(user);
        let admin_addr = address_of(admin);

        // Admin publishes the book
        publish_book_for_sale(admin, title, author, desc, uri, TEST_PRICE);
        let token_addr = create_book_token_address(&title);

        // Check initial balances and ownership
        let user_initial_balance = coin::balance<AptosCoin>(user_addr);
        let admin_initial_balance = coin::balance<AptosCoin>(admin_addr);
        let token_object: Object<Token> = object::address_to_object(token_addr);
        assert!(object::owner(token_object) == get_contract_object_address(), 8); // Owned by contract initially

        // User buys the book
        buy_book(user, token_addr);

        // Check final balances and ownership
        let user_final_balance = coin::balance<AptosCoin>(user_addr);
        let admin_final_balance = coin::balance<AptosCoin>(admin_addr);
        assert!(user_final_balance == user_initial_balance - TEST_PRICE, 9);
        assert!(admin_final_balance == admin_initial_balance + TEST_PRICE, 10);

        // Re-fetch token object to check new owner
        let token_object_after_buy: Object<Token> = object::address_to_object(token_addr);
        assert!(object::owner(token_object_after_buy) == user_addr, 11); // Owned by user now
    }

     #[test(aptos = @0x1, admin = @bookstore_addr, user = @0x123)]
     #[expected_failure(abort_code = 131074, location = aptos_framework::coin)] // EINSUFFICIENT_FUNDS from coin module
     fun test_buy_book_insufficient_funds(aptos: &signer, admin: &signer, user: &signer) acquires BookNFT, BookstoreInventory, ObjectController { // Adjusted acquires
         setup_test(aptos, admin, user);
         let title = string::utf8(TEST_BOOK_TITLE);
         let author = string::utf8(TEST_AUTHOR);
         let desc = string::utf8(TEST_DESC);
         let uri = string::utf8(TEST_URI);
         let high_price = 100 * 100_000_000; // 100 APT (more than user has)

         // Admin publishes the book with a high price
         publish_book_for_sale(admin, title, author, desc, uri, high_price);
         let token_addr = create_book_token_address(&title);

         // User tries to buy the book
         buy_book(user, token_addr);
     }

     #[test(aptos = @0x1, admin = @bookstore_addr, user = @0x123)]
     #[expected_failure(abort_code = 7, location = bookstore_addr::bookstore)] // EBOOK_ALREADY_OWNED (or potentially a different error if transfer_ref was consumed)
     fun test_buy_book_twice_fails(aptos: &signer, admin: &signer, user: &signer) acquires BookNFT, BookstoreInventory, ObjectController { // Adjusted acquires
         setup_test(aptos, admin, user);
         let title = string::utf8(TEST_BOOK_TITLE);
         let author = string::utf8(TEST_AUTHOR);
         let desc = string::utf8(TEST_DESC);
         let uri = string::utf8(TEST_URI);

         // Admin publishes the book
         publish_book_for_sale(admin, title, author, desc, uri, TEST_PRICE);
         let token_addr = create_book_token_address(&title);

         // User buys the book successfully
         buy_book(user, token_addr);

         // User tries to buy the *same* book again (now owned by user)
         buy_book(user, token_addr);
     }
}
