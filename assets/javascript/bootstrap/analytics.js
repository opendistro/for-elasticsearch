function trackOutboundLink(url) {
  console.log("Tracking downloads");
  console.log(url);
  ga('send', 'event', {
    eventCategory: 'Download link',
    eventAction: 'click',
    eventLabel: url,
    // transport: 'beacon'
  });
}
