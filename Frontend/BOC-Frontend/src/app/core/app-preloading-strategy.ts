import { PreloadingStrategy, Route } from "@angular/router";
import { Observable, timer, of } from "rxjs";
import { flatMap, tap } from "rxjs/operators";

export class AppPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    this.loadChatBox();
    return timer(800).pipe(
      tap(() => {
        return flatMap.call(load(), () => of(null));
      })
    );
  }
  // preload(route: Route, load: Function): Observable<any> {
  //     const loadRoute = (delay) => delay
  //         ? timer(150).pipe(flatMap(_ => load()))
  //         : load();
  //     return route.data && route.data.preload
  //         ? loadRoute(route.data.delay)
  //         : of(null);
  //   }

  loadChatBox() {
    // if (localStorage.getItem("UserName")) {
    //     $('[Id $= "rasaWebchatPro"]').css('display','block');
    //   var session_id = localStorage.getItem("sessionid");
    //   var userName = localStorage.getItem("UserName")
    //   var email = localStorage.getItem("UserEmailId")
    //   localStorage.setItem("customData", JSON.stringify({ language: "en", "userName": userName, "email": email }));
    //   let e = document.createElement("script"),
    //     t = document.head || document.getElementsByTagName("head")[0];
    //   // console.log(t);
    //   (e.src =
    //     "https://1821-2600-1f18-75d-4600-2f3b-b64b-ba04-9997.ngrok.io/rasa/lib/index.js"),
    //     // Replace 1.x.x with the version that you want
    //     (e.async = !0),
    //     (e.onload = () => {
    //       (window as any).WebChat.default(
    //         {
    //           customData: { language: "en", "userName": userName, "email": email, "session_id": session_id },
    //           socketUrl: "https://ab27-2600-1f18-75d-4600-2f3b-b64b-ba04-9997.ngrok.io",
    //           params: {
    //             storage: "session"
    //           }
    //           //old link - socketUrl: "http://16977b983d6e.ngrok.io/",
    //           // add other props here
    //         }
    //       );
    //     }),
    //     // alert("username: "+objects["user"]["firstname"]+" " +objects["user"]["lastname"]+"\n"+ "email: "+objects["user"]["email"])
    //     t.insertBefore(e, t.firstChild);
    // } else {
    //     $('[Id $= "rasaWebchatPro"]').css('display','none');
    // }
  }
}
