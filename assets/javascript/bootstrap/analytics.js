
function trackOutboundLink(url) {

  gtag('event', 'click', {
       'event_category': 'Download link',
       'event_label': url
  });
} 
