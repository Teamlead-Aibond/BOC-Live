/* ===================================================
 * @copyright Copyright  2020 - 2023 Aibond Corp.
 *
 * All Rights Reserved.
 *
 * ========================================================== */

function loadConversight() {
  conversight(function () {
    conversight.config({
      config: {
        authToken: "your_auth_token_here",
      },
      embed: [
        {
          type: "dashboard",
          hideFilter: false,
          hideTitle: false,
          id: "796653bc-45ab-4ca5-8f3d-b12223087f22",
          containerID: "cs-1acaced5-3d8a-4a60-abc1-2f101a4d3aca",
        },
      ],
    });
  });
}
