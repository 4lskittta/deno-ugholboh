 // server.js
 // アクセス数を保持する変数をグローバル領域に定義
 // localhostにDenoのHTTPサーバーを展開
 import { serveDir } from "https://deno.land/std@0.223.0/http/file_server.ts";
 let previousWord = "Монгол";
 let wordHistories = ["Монгол"];


 Deno.serve(async (request)=>{
     const pathname = new URL(request.url).pathname;
     console.log(`pathname: ${pathname}`);
  
    // GET /shiritori: 直前の単語を返す
     if (request.method === "GET" && pathname === "/shiritori") {
         return new Response(previousWord);
     }
    // POST /shiritori: 次の単語を入力する
     if (request.method === "POST" && pathname === "/shiritori") {
         // リクエストのペイロードを取得
         const requestJson = await request.json();
         // JSONの中からnextWordを取得
         const nextWord = requestJson["nextWord"];
 
         // previousWordの末尾とnextWordの先頭が同一か確認
         if (previousWord.slice(-1) === nextWord.slice(0, 1)) {
            if(nextWord.slice(-1)==="ь" || nextWord.slice(-1) === "ъ") {
                return new Response(
                    JSON.stringify({
                        "errorMessage2":"тоглоом дууслаа",
                        "errorCode":"10002"
                    }),
                    {
                        status:402,
                        headers:{"Content-Type":"application/json; charset=utf-8"},
                    }
                );
             } 
            else if(wordHistories.includes(nextWord)){
                return new Response(
                    JSON.stringify({
                        "errorMessage3":"өмнө нь оруулсан үг",
                        "errorCode":"10003"
                    }),
                    {
                        status:403,
                        headers:{"Content-Type":"application/json; charset=utf-8"},
                    }
                );
             } 
             else if(nextWord.length===1){
                return new Response(
                    JSON.stringify({
                        "errorMessage4":"1ээс дээш үсэгтэй үг оруулна уу",
                        "errorCode":"10004"
                    }),
                    {
                        status:404,
                        headers:{"Content-Type":"application/json; charset=utf-8"},
                    }
                );
             } 
             // 同一であれば、previousWordを更新
             previousWord = nextWord;
             wordHistories.push(previousWord);
         }
         // 同一でない単語の入力時に、エラーを返す             
      
         else {
             return new Response(
                 JSON.stringify({
                     "errorMessage1": "үсэг таарахгүй байна",
                     "errorCode": "10001"
                 }),
                 {
                     status: 401,
                     headers: { "Content-Type": "application/json; charset=utf-8" },
                 }
             );
         } 
 
         // 現在の単語を返す
         return new Response(previousWord);
     }
          // POST /reset: リセットする
          // request.methodとpathnameを確認
    if (request.method === "POST" && pathname === "/reset") {

              // 既存の単語の履歴を初期化する
              // 初期化した単語を返す
        previousWord = "Монгол";
        wordHistories = ["Монгол"]; 
        return new Response("Game reset successfully.");     
      }
               
       // ./public以下のファイルを公開
     return serveDir(
         request,
         {
             /*
             - fsRoot: 公開するフォルダを指定
             - urlRoot: フォルダを展開するURLを指定。今回はlocalhost:8000/に直に展開する
             - enableCors: CORSの設定を付加するか
             */
             fsRoot: "./public/",
             urlRoot: "",
             enableCors: true,
         }
     );
 
     });
