import { Hono } from "hono";

const dictionary = {
  '2046': 'https://gateway.irys.xyz/9JXHMxRqs3xFLH9F24KYMs1SqBYf7zUwMGRJtXY4MvLp',
  '2656': 'https://gateway.irys.xyz/DFL9WtBmzjcq6yEEeh5fK8zcGU7iJyuQP4kFtVhWwpC6',
  '3337': 'https://gateway.irys.xyz/FSAixZ6Gf9QrJgbyvGmhe3ifuNPcVrx9W4Eys6arbVSh',
  '3751': 'https://gateway.irys.xyz/8CUoSDRSD8ENxzpmujoCwC9ykzRjBnqiLrZXUNBW1re8',
  '3901': 'https://gateway.irys.xyz/HrtsqEs2zQ1mW492pfcqp25aGcS8SEvPTY68FtSNB2hQ',
  '4282': 'https://gateway.irys.xyz/7XV8pdaomNnSoUh6x6mzjptHuuTVoqaJK8avKbDupjQT',
  '4709': 'https://gateway.irys.xyz/APNTMNEXeh2hRiqPXAg2AfLJ6NVBqSMdiF2VURwXKKNM',
  '4822': 'https://gateway.irys.xyz/JAqEuHzar7hDsUvet2J1iPoPZ1Jsg7pkYqbAmxXSscQN',
  '5411': 'https://gateway.irys.xyz/HFWPUacVfcpTkQWaFQ1y6VwawDdnPXdsgUPtfLftmwVc',
  '6371': 'https://gateway.irys.xyz/3hubqx6WyJxQwhACbmdh5qQvQ9ZQrs1ufhw2R9RYynHG',
  '6730': 'https://gateway.irys.xyz/B4MC1LNh846FyuZcvvi8ndMWwGa7a9nCHMokBBerky84',
  '6799': 'https://gateway.irys.xyz/122AdZKvBETDwxs9sTrqYGsGqoXcFnc9aTUsGpHdvu59',
  '6861': 'https://gateway.irys.xyz/DbrKpFzbsmPAnxnLxZJeDXeNo5LAKjLCbprLvMEqtqr6',
  '7133': 'https://gateway.irys.xyz/U7yAaLpdsnB3mxzuiRzAmQLL7oaKkLNeJ6ebxht8MQF',
  '7723': 'https://gateway.irys.xyz/BKTqNiAMpwU5RaxNCbv7bDCbvzfk122FwNMNPq3Ucbd4',
  '7806': 'https://gateway.irys.xyz/BKC3hbcMzvMah7A1vo8JSH5o3U3rLANGcaCSu1AGFY97',
  '9500': 'https://gateway.irys.xyz/7NWsMrWQLpir2cNdcfAGW1S9Q1Ei9kFYRBjppUSK8JgR',
  '9992': 'https://gateway.irys.xyz/Fsb8Jg1TmB4vCF3JFC9zshcdmezbYXcHiTPYazAnjj2N',
  '0655': 'https://gateway.irys.xyz/5yWZPuJQknGXVG1MM4B7HZzXa1eWkCU2stZKUsSx1zuc'
};

const name_dict = {
  '2046': 'The Goldfinch (Donna Tartt).epub',
  '2656': 'Project Hail Mary (Andy Weir).epub',
  '3337': 'Frank Herberts Dune Saga Collection (Frank Herbert).epub',
  '3751': 'Snow Crash (Neal Stephenson).epub',
  '3901': 'The Final Empire Mistborn Triology (Brandon Sanderson).epub',     
  '4282': 'The Priory of the Orange Tree (Samantha Shannon).pdf',
  '4709': 'Project Hail Mary (Andy Weir).pdf',
  '4822': 'Astrophysics for People in a Hurry (Neil deGrasse Tyson).epub',
  '5411': 'Normal People (Sally Rooney).epub',
  '6371': 'The Silent Patient (Alex Michaelides).epub',
  '6730': 'Verity (Colleen Hoover).epub', 
  '6799': 'The Name of the Wind (Patrick Rothfuss).epub',
  '6861': 'The Goldfinch (Donna Tartt).pdf',
  '7133': 'The Silent Patient (Alex Michaelides).pdf',
  '7723': 'Snow Crash (Neal Stephenson).pdf',
  '7806': 'Gone Girl (Gillian Flynn).epub',
  '9500': 'The Priory of the Orange Tree (Samantha Shannon).epub',
  '9992': 'A Little Life A Novel (Hanya Yanagihara).epub',
  '0655': 'The Gene An Intimate History (Siddhartha Mukherjee).epub'
}

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get("/", (c) => {
  return c.text("I'm alivee")
});

app.get("/book/:bookId", async (c) => {
  const bookId = c.req.param("bookId") as keyof typeof dictionary;
  const url = dictionary[bookId];
  const filename = name_dict[bookId];
  if (!url || !filename) {
    return c.text("Not found", 404);
  }
  const res = await fetch(url);
  const contentType = res.headers.get("Content-Type") || "application/octet-stream";
  const data = await res.arrayBuffer();
  return c.body(data, 200, {
    "Content-Type": contentType,
    "Content-Disposition": `attachment; filename="${filename}"`
  });
});

export default app;
