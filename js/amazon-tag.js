/**
 * Amazon Associates tracking tag for Coach's Picks.
 * Swap TAG_PENDING for the live Associates tag in AMAZON_TAG below
 * and in the matching href query strings when the account is ready.
 * Anchor hrefs already include tag=TAG_PENDING so links work without JavaScript.
 */
(function () {
  var AMAZON_TAG = "TAG_PENDING";
  document.querySelectorAll("a[data-amazon-asin]").forEach(function (link) {
    var asin = link.getAttribute("data-amazon-asin");
    if (!asin) return;
    link.href = "https://www.amazon.com/dp/" + encodeURIComponent(asin) + "?tag=" + encodeURIComponent(AMAZON_TAG);
  });
})();
