        //let resizedPane: Pane;
        let overlayWidth;
        let overlayHeight;
        let targetEvent = {
            rect: {
                width: 0,
                height: 0
            }
        };
        let lastLocation;
        let currentLocation = [];
        let isPaneCollided = false;
        let moveLocation;
        interact('.c-pane-resizing')
            .allowFrom('.c-pane-resizer')
            .draggable({
                inertia: false,
                // keep the element within the area of it's parent
                snap: {
                    targets: [
                      interact.createSnapGrid({ x: 30, y: 30 })
                    ],
                    range: Infinity,
                    relativePoints: [ { x: 0, y: 0 } ]
                  },
                restrict: {
                    restriction: '.layout-area',
                    endOnly: true,
                    elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
                },
                autoScroll: false,
                onstart: (event) => {
                    let target = event.target;
                   // resizedPane = this._paneHelpersService.getPane(parseInt(event.target.parentElement.getAttribute('id')), this._page);
                    //target.style.width = 200 + 'px';
                   // target.style.height = 200 + 'px';
                    target.style.backgroundColor = 'rgba(0,0,0,0.3)';
                    overlayWidth = event.target.parentElement.clientWidth;
                    overlayHeight = event.target.parentElement.clientHeight;
                    lastLocation = { rect: { width: overlayWidth, height: overlayHeight } };
                    isPaneCollided = false;
                    currentLocation = [];
                },
                onmove: (event) => {
                    let target = event.target;
                    currentLocation.push({ rect: { width: target.clientWidth, height: target.clientHeight}});
                    overlayWidth = overlayWidth + event.dx;
                    overlayHeight = overlayHeight + event.dy;
                    target.style.width = overlayWidth + 'px';
                    target.style.height = overlayHeight + 'px';
                   
                    console.log(isPaneCollided, event);
                    console.log('onmove=>',event.target.clientWidth, event.target.clientHeight);
                },
                onend: (event) => {
                    event.target.style.backgroundColor = '';
                    if (isPaneCollided) {
                        currentLocation[currentLocation.length - 2] = lastLocation;
                        isPaneCollided = false;
                     } 
                     //last location is wrong, so we are getting 2nd last value
                     moveLocation = currentLocation[currentLocation.length -2] ? currentLocation[currentLocation.length -2] : lastLocation;

                     //change c-pane-resizing size
                     event.target.style.width = moveLocation.rect.width + 'px';
                     event.target.style.height = moveLocation.rect.height + 'px';

                     //change panesize
                     event.target.parentElement.style.width = moveLocation.rect.width + 'px';
                     event.target.parentElement.style.height = moveLocation.rect.height + 'px';
                     // this._onPaneResizeMove(currentLocation, resizedPane, dragErrorConfirmModal);s
                }
            });
        interact('.c-pane-resizing')
            .dropzone({
                accept: '.c-pane-resizing',
                // Require a 1% element overlap for a drop to be possible
                overlap: 0.01,
                ondragenter: (event) => {
                    isPaneCollided = true;
                    event.relatedTarget.style.backgroundColor = 'rgba(255,0,0,0.3)';
                },
                ondragleave: (event) => {
                    isPaneCollided = false;
                    event.relatedTarget.style.backgroundColor = 'rgba(0,0,0,0.3)';
                }
            });