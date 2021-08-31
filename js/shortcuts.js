/* Add keyboard shortcuts for links */

function addShortcuts() {
  // extend as needed
  var shortcut_order = ['a', 's', 'd', 'f', 'j', 'k', 'l', 'g', 'h', 'q', 'w', 'e', 'r', 't', 'u', 'i', 'o',
                        'p', 'v', 'n', 'z', 'x', 'c', 'm', 'b', 'y', ';', '\'', ',', '.', '/', '[', '1', '2',
                        '3', '4', '5', '6', '7', '8', '9', '0'
                       ]


  var links = document.querySelectorAll(".links a")
  var shortcuts = {}

  for (var i = 0; i < links.length; i++) {
    node = links[i]
    key = shortcut_order[i]

    node.text = key + ": " + node.text
    shortcuts[key] = node.href
  }

  document.addEventListener('keydown', function(event) {
    // only want to use shortcuts when not using *other* shortcuts
    if (event.metaKey || event.altKey || event.ctrlKey) {
      return;
    }
    if (event.key in shortcuts) {
      window.location.href = shortcuts[event.key];
    }
  });
}
addShortcuts();
