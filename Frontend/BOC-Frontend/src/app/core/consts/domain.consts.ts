/* ===================================================
 * @copyright Copyright  2020 - 2023 Aibond Corp.
 *
 * All Rights Reserved.
 *
 * ========================================================== */

let DOMAINS = [
  {
    domainName: "local",
    frontEnd: "http://localhost:4200/#",
    loginUrl: "http://localhost:3000/users/domainlogin",
    // loginUrl: "http://143.110.246.50:3000/users/domainlogin",
  },
  {
    domainName: "BOCAPI",
    frontEnd: "http://aibondboc.com/#",
    //frontEnd: "http://143.110.246.50/#",
    loginUrl: "http://143.110.246.50:3000/users/domainlogin",
  },
  {
    domainName: "BOC",
    frontEnd: "http://memsdevops.com/#",
    loginUrl: "http://3.132.33.146:3000/users/domainlogin",
    //loginUrl: "http://bocapi.memsdevops.com:3000/users/domainlogin",
  },
];
export { DOMAINS };
