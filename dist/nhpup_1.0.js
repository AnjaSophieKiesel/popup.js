/*
--------------------------------------------------------------------------
Code for link-hover text boxes
By Nicolas Höning
Usage: <a onmouseover="popup('popup content', width)">a link</a>
 (width is optional - default is in CSS: #pup {width: x;},
  escape " in content with &quot;)
Tutorial and support at http://nicolashoening.de?twocents&nr=8
--------------------------------------------------------------------------

The MIT License (MIT)

Copyright (c) 2014 Nicolas Höning

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/


var minMargin = 15; // set how much minimal space there should be (in pixels)
                    // between the popup and everything else (borders, mouse)
var ready = false;  // we are ready when the mouse event is set up
var default_width = 200; // will be set to width from css in document.ready

/* Prepare popup and define the mouseover callback */
jQuery(document).ready(function(){
    $('body').append('<div id="pup" style="position:absolute; display:none; z-index:200;"></div>');
    css_width = $('#pup').width();
    if (css_width != 0) default_width = css_width;
    // set dynamic coords when the mouse moves
    $(document).mousemove(function(e){ 
        var x,y;
      
        x = $(document).scrollLeft() + e.clientX;
        y = $(document).scrollTop() + e.clientY;

        x += 10; // important: if the popup is where the mouse is, the hoverOver/hoverOut events flicker
      
        var x_y = nudge(x,y); // avoids edge overflow
      
        // remember: the popup is still hidden
        $('#pup').css('top', x_y[1] + 'px');
        $('#pup').css('left', x_y[0] + 'px');
    });
    ready = true;
});

/*
 The actual callback:
 Write message, show popup w/ custom width if necessary,
 make sure it disappears on mouseout
*/
function popup(msg, width)
{
    if (ready) {
        // use default width if not customized here
        if (typeof width === "undefined"){
            width = default_width;
        }
        // write content and display
        $('#pup').html(msg).width(width).show();
        // make sure popup goes away on mouse out
        // the event obj needs to be gotten from the virtual 
        //   caller, since we use onmouseover='popup(msg)' 
        var t = getTarget(arguments.callee.caller.arguments[0]);
        $(t).unbind('mouseout').bind('mouseout', 
            function(e){
                $('#pup').hide().width(default_width);
            }
        );
    }
}

/* Avoid edge overflow */
function nudge(x,y)
{
    var win = $(window);
    
    // When the mouse is too far on the right, put window to the left
    var xtreme = $(document).scrollLeft() + win.width() - $('#pup').width() - minMargin;
    if(x > xtreme) {
        x -= $('#pup').width() + 2 * minMargin;
    }
    x = max(x, 0);

    // When the mouse is too far down, move window up
    if((y + $('#pup').height()) > (win.height() +  $(document).scrollTop())) {
        y -= $('#pup').height() + minMargin;
    }

    return [ x, y ];
}

/* custom max */
function max(a,b){
    if (a>b) return a;
    else return b;
}

/*
 Get the target (element) of an event.
 Inspired by quirksmode
*/
function getTarget(e) {
    var targ;
    if (!e) var e = window.event;
    if (e.target) targ = e.target;
    else if (e.srcElement) targ = e.srcElement;
    if (targ.nodeType == 3) // defeat Safari bug
        targ = targ.parentNode;
    return targ;
}
