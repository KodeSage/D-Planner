import { Web3Storage, File, Blob } from "web3.storage";

const U_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEE1YTI3ODljMmFlZDk3MThEOWU0NjcyNGUwZTBFZTBDZjY1MDM1ZDEiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjM3NzE3OTU3MDEsIm5hbWUiOiJkcGxhbm5lcl92MiJ9.9uDhoduUSo9-xN5xdJiBvwS2J7BNfTx6pcKP5pdsgko";
function getAccessToken () {
    return process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN;
}
function makeStorageClient () {
  return new Web3Storage( { token: U_token} )
}

export default async function UploadFilesToWeb3Storage(body, file)
{   

    const newFile = new File([file], file.name, {type: file.type});
    const client = makeStorageClient()
    const blob = new Blob( [ JSON.stringify(body) ], { type: 'application/json' } );
    const files = [ new File( [blob], 'data.json' ), newFile  ];
    const cid = await client.put( files );
    console.log('stored files with cid:', cid)
    return cid;
}





