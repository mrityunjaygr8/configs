window.PRISM = {
  colorstops : {
    "white": {
      "grey1": "rgb(255, 255, 255)",
      "grey2": "rgb(255, 255, 255)",
      "grey3": "rgb(255, 255, 255)",
      "grey4": "rgb(244, 244, 244)",
      "grey5": "rgb(234, 234, 234)",
      "grey6": "rgb(202, 202, 202)",
      "grey7": "rgb(160, 160, 160)",
      "grey8": "rgb(118, 118, 118)",
      "grey9": "rgb(80, 80, 80)",
      "grey10": "rgb(50, 50, 50)"
    },
    "light": {
      "grey1": "rgb(255, 255, 255)",
      "grey2": "rgb(250, 250, 250)",
      "grey3": "rgb(245, 245, 245)",
      "grey4": "rgb(234, 234, 234)",
      "grey5": "rgb(225, 225, 225)",
      "grey6": "rgb(194, 194, 194)",
      "grey7": "rgb(153, 153, 153)",
      "grey8": "rgb(112, 112, 112)",
      "grey9": "rgb(75, 75, 75)",
      "grey10": "rgb(44, 44, 44)"
    },
    "dark": {
      "grey1": "rgb(40, 40, 40)",
      "grey2": "rgb(45, 45, 45)",
      "grey3": "rgb(50, 50, 50)",
      "grey4": "rgb(57, 57, 57)",
      "grey5": "rgb(62, 62, 62)",
      "grey6": "rgb(82, 82, 82)",
      "grey7": "rgb(112, 112, 112)",
      "grey8": "rgb(153, 153, 153)",
      "grey9": "rgb(205, 205, 205)",
      "grey10": "rgb(255, 255, 255)"
    },
    "extradark": {
      "grey1": "rgb(22, 22, 22)",
      "grey2": "rgb(29, 29, 29)",
      "grey3": "rgb(35, 35, 35)",
      "grey4": "rgb(42, 42, 42)",
      "grey5": "rgb(49, 49, 49)",
      "grey6": "rgb(69, 69, 69)",
      "grey7": "rgb(99, 99, 99)",
      "grey8": "rgb(138, 138, 138)",
      "grey9": "rgb(185, 185, 185)",
      "grey10": "rgb(232, 232, 232)"
    }
  },

  commoncolors : {
    "red1": "rgb(255, 105, 105)",
    "red2": "rgb(245, 60, 60)",
    "red3": "rgb(230, 20, 20)",
    "red4": "rgb(210, 10, 10)",
    "red5": "rgb(180, 0, 0)",

    "yellow1": "rgb(240, 210, 110)",
    "yellow2": "rgb(235, 190, 50)",
    "yellow3": "rgb(231, 176, 0)",
    "yellow4": "rgb(230, 160, 0)",
    "yellow5": "rgb(220, 145, 0)",

    "green1": "rgb(70, 170, 70)",
    "green2": "rgb(20, 155, 20)",
    "green3": "rgb(15, 135, 15)",
    "green4": "rgb(10, 120, 10)",
    "green5": "rgb(0, 100, 0)",

    "blue1": "rgb(70, 160, 245)",
    "blue2": "rgb(45, 140, 235)",
    "blue3": "rgb(20, 115, 230)",
    "blue4": "rgb(0, 100, 220)",
    "blue5": "rgb(0, 90, 190)",

    "periwinkle": "rgb(115, 75, 195)",
    "plum": "rgb(150, 60, 115)",
    "fuchsia": "rgb(230, 20, 130)",
    "magenta": "rgb(205, 0, 95)",
    "orange": "rgb(240, 80, 0)",
    "tangerine": "rgb(250, 140, 0)",
    "chartreuse": "rgb(120, 200, 35)",
    "kellygreen": "rgb(0, 135, 15)",
    "seafoam": "rgb(30, 180, 140)",
    "cyan": "rgb(5, 175, 230)",

    "transparent": "rgba(0, 0, 0, 0)",
    "grey": "rgb(112, 112, 112)",
    "blue": "rgb(20, 115, 230)"
  },

	copy: {
		"12px" : "Small Copy",
		"14px": "Regular Copy",
		"18px": "Large Copy",
	},

	mobilecopy: {
		"14px" : "Small Copy",
		"17px": "Regular Copy",
		"20px": "Large Copy",
	},

	altcopy: [
		{
			fontsize: '12px',
			color: 'XXX',
			name: 'Label Text'
		}
	],




whatcolor: function (x){
  var stops = [PRISM.colorstops.light, PRISM.colorstops.dark, PRISM.colorstops.extradark, PRISM.colorstops.white];
  var colors = ['Light', 'Dark', 'Extra-Dark', 'White'];
  var str = '';
  for(var i=0;i<stops.length;i++){
    var greys = stops[i];
    var color = colors[i];
    for (var k in greys) {
      if (!greys.hasOwnProperty(k)) continue;
      if (greys[k] === x) {
        //return k;
        str += k + ' (' + color + '); ';
      }
    }
  }

  var common = PRISM.commoncolors;

  for (var k in common) {
    if (!common.hasOwnProperty(k)) continue;
    if (common[k] === x) {
      str += k + '; ';
    }
  }


  if ( str == '' ) {
    console.warn('unknown color');
    return 'unknown';
  }

  return str;
},

prezep: function (e){
  var x = e.clientX;
  var y = e.clientY;

  document.body.classList.remove('MAGIC');

  var element = document.elementFromPoint(x, y);

  document.body.classList.add('MAGIC');

  if ( e.shiftKey ){
    element = element.parentElement;
  }

  if ( this.prezeplin == element ){
    return;
  }

  PRISM.clearpre();

  this.prezeplin = element;

  if ( element == document.body || element == document.documentElement ){
    return;
  }

  var rp = element.PRISMup('PRISMredlinepanel');

  if ( rp ){
    return;
  }

  var w = element.offsetWidth;
  var h = element.offsetHeight;
  var coords = element.getBoundingClientRect();
  var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
  var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;

  //if body is position relative/absolute and has a margin set to it. Have to compensate
  var body = window.getComputedStyle(document.body, null);
  var pos = body.getPropertyValue('position');

  if ( pos == 'relative' || pos == 'absolute' ){
    scrollY -= parseFloat(body.getPropertyValue('margin-top')) || 0;
    scrollX -= parseFloat(body.getPropertyValue('margin-left')) || 0;
  }

  var box = document.createElement('div');

  //box.style.position = 'absolute';
  //box.style.zIndex = 1234567890;
  box.style.top = scrollY + coords.top + 'px';
  box.style.left = scrollX + coords.left + 'px';

  box.style.width = coords.width + 'px';
  box.style.height = coords.height + 'px';

  box.dataset.width = coords.width;
  box.dataset.height = coords.height;
  box.dataset.value = Math.round(coords.width) + ' x ' + Math.round(coords.height);

  //box.style.background = 'rgba(0,0,150,.6)';



  box.className = 'PRISMprezeplin';

  document.body.appendChild(box);


  var redline = document.getElementsByClassName('PRISMredline')[0];

  if ( !redline ){
    return;
  }
  var border = redline.getElementsByClassName('border')[0];

  var bounds = border.getBoundingClientRect();

  var y1 = bounds.top;
  var y2 = bounds.bottom;
  var x1 = bounds.left;
  var x2 = bounds.right;

  var y1b = coords.top;
  var y2b = coords.bottom;
  var x1b = coords.left;
  var x2b = coords.right;


  var dy = 0;
  var dx = 0;
  var ty = 0;
  var tx = 0;

  if ( y1b >= y2 ){
    dy = y1b - y2
    ty = y2;
  } else if ( y1b >= y1 ){
    dy = y1b - y1;
    ty = y1;
  } else if ( y1 >= y2b) {
    dy = y1 - y2b;
    ty = y2b;
  } else if ( y1 > y1b ){
    dy = y1 - y1b;
    ty = y1b;
  } else {
    console.warn('dist y issue')
  }

  if ( x1b >= x2 ){
    dx = x1b - x2
    tx = x2;
  } else if ( x1b >= x1 ){
    dx = x1b - x1;
    tx = x1;
  } else if ( x1 > x2b) {
    dx = x1 - x2b;
    tx = x2b
  } else if ( x1 > x1b ){
    dx = x1 - x1b;
    tx = x1b
  } else {
    console.warn('dist x issue')
  }




  console.log(tx, ty);
  // var dist = document.createElement('div');
  // var info = document.createElement('div');
  // dist.className = 'PRISMdistance';
  // dist.style.position = 'absolute';
  // dist.style.top = scrollY +  ty + 'px';
  // dist.style.left = scrollX +  tx + 'px';
  //
  // dist.style.width = dx + 'px';
  // dist.style.height = dy + 'px';

  dx = Math.round(dx);
  dy = Math.round(dy);

  // dist.dataset.x = dx;
  // dist.dataset.y = dy;
  // dist.dataset.value = 'x: ' + dx + ' - y: ' + Math.round(dy);



  ////
  if ( dy > 0 ){
    var yline = document.createElement('div');
    var f1 = document.createElement('div');
    var f2 = document.createElement('div');
    yline.className = 'PRISMdistance2 PRISMy';

    yline.style.height = dy + 'px';
    yline.style.top = scrollY +  ty + 'px';
    yline.style.left = coords.left + (coords.width / 2) + scrollX - 1 + 'px';

    yline.dataset.value = dy;

    yline.appendChild(f1);
    yline.appendChild(f2);

    document.body.appendChild(yline);
  }

  if ( dx > 0 ){
    var xline = document.createElement('div');
    var f1 = document.createElement('div');
    var f2 = document.createElement('div');
    xline.className = 'PRISMdistance2 PRISMx';

    xline.style.width = dx + 'px';
    xline.style.top = coords.top + (coords.height /2) + scrollY - 1 + 'px';
    xline.style.left = scrollX + tx + 'px';

    xline.dataset.value = dx;

    xline.appendChild(f1);
    xline.appendChild(f2);

    document.body.appendChild(xline);

  }


  if ( y1 > y1b && y2 < y2b || y1 < y1b && y2 > y2b ){
    console.log('vertically inside');
    var bottomy = Math.abs(y2 - y2b);


    if ( bottomy > .5 ){
      var y2line = document.createElement('div');
      var f1 = document.createElement('div');
      var f2 = document.createElement('div');

      var iy = y2 < y2b ? y2 : y2b;

      y2line.className = 'PRISMdistance2 PRISMy2 PRISMy';

      y2line.style.height = bottomy + 'px';
      y2line.style.top = scrollY +  iy + 'px';
      y2line.style.left = coords.left + (coords.width / 2) + scrollX - 1 + 'px';

      y2line.dataset.value = Math.round(bottomy);

      y2line.appendChild(f1);
      y2line.appendChild(f2);

      document.body.appendChild(y2line);
    }
  }

  if ( x1 > x1b && x2 < x2b || x1 < x1b && x2 > x2b ){
    console.log('horz inside');
    var rightx = Math.abs(x2 - x2b);
    if ( rightx > .5 ){
      var x2line = document.createElement('div');
      var f1 = document.createElement('div');
      var f2 = document.createElement('div');
      x2line.className = 'PRISMdistance2 PRISMx PRISMx2';

      var ix = x2 < x2b ? x2 : x2b;

      x2line.style.width = rightx + 'px';
      x2line.style.top = coords.top + (coords.height /2) + scrollY - 1 + 'px';
      x2line.style.left = scrollX + ix + 'px';

      x2line.dataset.value = Math.round(rightx);

      x2line.appendChild(f1);
      x2line.appendChild(f2);

      document.body.appendChild(x2line);
    }
  }

  ////



  // dist.style.background = 'rgba(0,0,0,.1)';
  // dist.style['pointer-events'] = 'none';
  //
  // //dist.style.borderRight = '1px solid rgba(0,0,0,.2)';
  // //dist.style.borderBottom = '1px solid rgba(0,0,0,.2)';
  //
  // var placement = '';
  // if ( dx > 48 && dy > 48 ){
  //   placement = 'PRISMcentered';
  // }
  //
  //
  // var l1 = document.createElement('div');
  // var l2 = document.createElement('div');
  // var s1 = document.createElement('span');
  // var s2 = document.createElement('span');
  //
  // info.className = 'PRISMdistanceinfo ' + placement;
  //
  // s1.style.color = s2.style.color = 'rgba(255,255,255,.5)';
  // s1.style.display = s2.style.display = 'inline-block';
  // s1.style.minWidth = s2.style.minWidth = '16px';
  // //s1.style.textAlign = s2.style.textAlign = 'center';
  //
  // s1.appendChild(document.createTextNode('↔'));
  // s2.appendChild(document.createTextNode('↕'));
  //
  // l1.appendChild(s1);
  // l2.appendChild(s2);
  //
  // l1.appendChild(document.createTextNode(dx));
  // l2.appendChild(document.createTextNode(dy));
  //
  // info.appendChild(l1);
  // info.appendChild(l2);
  //
  // dist.appendChild(info);
  //
  // document.body.appendChild(dist);

  console.log(dy);
  console.log(dx);

  // dy = coords.top - bounds.top;
  //var dx = coords.left - bounds.left;
},

zeplin: function (e){
  var x = e.clientX;
  var y = e.clientY;

  document.body.classList.remove('MAGIC');

  var element = document.elementFromPoint(x, y);

  document.body.classList.add('MAGIC');

  //var element = e.target;

  if ( !element || element.classList.contains('PRISMredline') ){
    return;
  }

  if ( e.shiftKey ){
    element = element.parentElement;
  }

  var rp = element.PRISMup('PRISMredlinepanel');

  if ( rp ){
    return;
  }

  e.preventDefault();
  e.stopPropagation();

  var colors = {};

  PRISM.clearredlines();

  /*var oldpanel = document.getElementsByClassName('PRISMredlinepanel');
  var count = oldpanel.length;
  for(var i=0;i<count;i++){
    var a = oldpanel[0];
    a.parentNode.removeChild(a);
  }*/
  element.blur();
  //element.offsetWidth;
	window.getComputedStyle(element, null).opacity;
  //sleep(5000);

  //var w = element.offsetWidth;
  //var h = element.offsetHeight;
  var coords = element.getBoundingClientRect();
  var scrollY = document.documentElement.scrollTop || document.body.scrollTop || 0;
  var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft || 0;
  var computed = window.getComputedStyle(element, null);
  var redlines = {};

  redlines.elementname = element.dataset ? element.dataset.name || element.className || element.tagName : element.className || element.tagName;
  redlines.width = coords.width;
  redlines.height = coords.height;

  redlines.widthCSS = computed.getPropertyValue('width');
  redlines.heightCSS = computed.getPropertyValue('height');

  redlines.widthCSS = redlines.widthCSS == 'auto' ? 'none' : redlines.widthCSS;
  redlines.heightCSS = redlines.heightCSS == 'auto' ? 'none' : redlines.heightCSS;

  var opacity = computed.getPropertyValue('opacity');
  redlines.opacity = opacity != '1' ? Number(opacity) * 100 + '%' : '';

  redlines.showopacity = redlines.opacity == '' ? 'none' : '';

  redlines['font-size']     = computed.getPropertyValue('font-size');
  redlines['font-family']   = computed.getPropertyValue('font-family');
  redlines['font-weight']   = computed.getPropertyValue('font-weight');
  redlines['font-color']    = computed.getPropertyValue('color');

  redlines.fontRGB = redlines['font-color'];

  //redlines['font-color'] = whatcolor(redlines['font-color']) + ' - ' + redlines['font-color'];

  var bt = parseFloat(computed.getPropertyValue('border-top'))     || 0;
  var br = parseFloat(computed.getPropertyValue('border-right'))   || 0;
  var bb = parseFloat(computed.getPropertyValue('border-bottom'))  || 0;
  var bl = parseFloat(computed.getPropertyValue('border-left'))    || 0;

  var pt = parseFloat(computed.getPropertyValue('padding-top'))     || 0;
  var pr = parseFloat(computed.getPropertyValue('padding-right'))   || 0;
  var pb = parseFloat(computed.getPropertyValue('padding-bottom'))  || 0;
  var pl = parseFloat(computed.getPropertyValue('padding-left'))    || 0;

  var mt = parseFloat(computed.getPropertyValue('margin-top'))      || 0;
  var mr = parseFloat(computed.getPropertyValue('margin-right'))    || 0;
  var mb = parseFloat(computed.getPropertyValue('margin-bottom'))   || 0;
  var ml = parseFloat(computed.getPropertyValue('margin-left'))     || 0;



  //if body is position relative/absolute and has a margin set to it. Have to compensate
  var body = window.getComputedStyle(document.body, null);
  var pos = body.getPropertyValue('position');

  if ( pos == 'relative' || pos == 'absolute' ){
    scrollY -= parseFloat(body.getPropertyValue('margin-top')) || 0;
    scrollX -= parseFloat(body.getPropertyValue('margin-left')) || 0;
  }


  ///window.getComputedStyle(	document.querySelector('.element'), ':before').getPropertyValue('color')

  //var boxshadow = 'inset 0 0 0 133333333337px rgba(20, 150, 255, 0.6),';

  console.log(pt, pr, pb, pl);
  console.log(mt, mr, mb, ml);

  console.log(coords.top, coords.right, coords.bottom, coords.left);


  if ( pt ){
    redlines['padding-top'] = pt;
  }
  if ( pr ){
    redlines['padding-right'] = pr;
  }
  if ( pb ){
    redlines['padding-bottom'] = pb;
  }
  if ( pl ){
    redlines['padding-left'] = pl;
  }

  if ( bt ){
    redlines['border-top'] = bt;
  }
  if ( br ){
    redlines['border-right'] = br;
  }
  if ( bb ){
    redlines['border-bottom'] = bb;
  }
  if ( bl ){
    redlines['border-left'] = bl;
  }

  if ( mt ){
    //boxshadow += '0 ' + -mt + 'px rgba(255,135,0,.5),';
    redlines['margin-top'] = mt;
  }

  if ( mr ){
    //boxshadow += mr + 'px 0 rgba(255,135,0,.5),';
    redlines['margin-right'] = mr;
  }

  if ( mb ){
    //boxshadow += '0 ' + mb + 'px rgba(255,135,0,.5),';
    redlines['margin-bottom'] = mb;
  }

  if ( ml ){
    //boxshadow += -ml + 'px 0 rgba(255,135,0,.5)';
    redlines['margin-left'] = ml;
  }

  //boxshadow = boxshadow.replace(/[,]$/,'');

  var y1 = scrollY + coords.top;
  var x1 = scrollX + coords.left;

  //var wy = y1 +


  var bounds = document.createElement('div');
  var padding = document.createElement('div');
  var border = document.createElement('div');
  var margin = document.createElement('div');
  var wrap = document.createElement('div');
  var superwrap = document.createElement('div');

  //bounds
  // bounds.style.position = 'absolute';
  // bounds.style.top = y1 + 'px';
  // bounds.style.left = bounds.left + 'px';

  //
  // bounds.style.boxSizing = 'border-box';

  var bw = coords.right - coords.left - pl - pr - bl - br;
  var bh = coords.bottom - coords.top - pt - pb - bt - bb;

  bounds.style.width = bw + 'px';
  bounds.style.height = bh + 'px';

  bounds.style.background = 'rgba(100,175,255,.4)';



  bounds.dataset.width = bw;
  bounds.dataset.height = bh;
  // bounds.style.lineHeight = h + 'px';
  // bounds.style.textAlign = 'center';
  // bounds.style.color = 'white';
  bounds.style.position = 'relative';

  bounds.className = 'bounds';




  //padding
  //  switch to padding or so borders can't to decimal sizes ??
  // padding.style.borderColor = 'rgba(140,200,115,.7)';
  // padding.style.borderStyle = 'solid'
  // padding.style.borderTopWidth = pt + 'px';
  // padding.style.borderRightWidth = pr + 'px';
  // padding.style.borderBottomWidth = pb + 'px';
  // padding.style.borderLeftWidth = pl + 'px';

  padding.style.backgroundColor = 'rgba(140,200,115,.4)';
  padding.style.paddingTop = pt + 'px';
  padding.style.paddingRight = pr + 'px';
  padding.style.paddingBottom = pb + 'px';
  padding.style.paddingLeft = pl + 'px';


  padding.className = 'padding';


  //border
  border.style.borderColor = 'rgba(255,220,100,.7)';
  border.style.borderStyle = 'solid'
  border.style.borderTopWidth = Math.max(bt, 0) + 'px';
  border.style.borderRightWidth = Math.max(br, 0) + 'px';
  border.style.borderBottomWidth = Math.max(bb, 0) + 'px';
  border.style.borderLeftWidth = Math.max(bl, 0) + 'px';

  border.dataset.redline = bt + ' ' + br + ' ' + bb + ' ' + bl;

  border.className = 'border';


  //margin
  margin.style.borderColor = 'rgba(255,180,100,.7)';
  margin.style.borderStyle = 'solid'
  margin.style.borderTopWidth = Math.max(mt, 0) + 'px';
  margin.style.borderRightWidth = Math.max(mr, 0) + 'px';
  margin.style.borderBottomWidth = Math.max(mb, 0) + 'px';
  margin.style.borderLeftWidth = Math.max(ml, 0) + 'px';

  margin.dataset.redline = mt + ' ' + mr + ' ' + mb + ' ' + ml;

  margin.className = 'margin';


  //wrap
  wrap.style.position = 'absolute';
  wrap.style.top = y1 - Math.max(mt, 0) + 'px';
  wrap.style.left = x1 - Math.max(ml, 0) + 'px';



  wrap.style.boxSizing = 'border-box';

  wrap.dataset.width = coords.width;//w;
  wrap.dataset.height = coords.height;//h;

  wrap.dataset.value = Math.round(coords.width) + ' x ' + Math.round(coords.height);

  wrap.className = 'PRISMredlineactual';

  superwrap.className = 'PRISMredline'

  var actualWidth = Math.max( document.body.scrollWidth, document.body.offsetWidth, document.documentElement.clientWidth, document.documentElement.scrollWidth, document.documentElement.offsetWidth );
  var actualHeight = Math.max( document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight );

  superwrap.style.width = actualWidth + 'px';
  superwrap.style.height = actualHeight + 'px';

  var fillcolor = computed.getPropertyValue('background-color');

  var spectrumfill = PRISM.whatcolor(fillcolor);
  var spectrumfont = PRISM.whatcolor(redlines.fontRGB);

  redlines.fillSwatch = spectrumfill == 'unknown' ? 'none' : '';
  redlines.fontSwatch = spectrumfont == 'unknown' ? 'none' : '';

  redlines.fillColor = fillcolor;
  redlines.colorInfo = spectrumfill;

  redlines.rgbfill = fillcolor;
  redlines.hexfill = spectrumfill.indexOf('transparent') < 0 ? PRISM.rgbtohex(fillcolor) : 'na';

  redlines.fill = spectrumfill.indexOf('transparent') < 0 ? 'block' : 'none';


  redlines.fontColor = spectrumfont;
  redlines.fontHex = spectrumfont !== 'transparent' ? PRISM.rgbtohex(redlines.fontRGB) : 'na';
  redlines.fontSize = redlines['font-size'];
  redlines.fontWeight = redlines['font-weight'];

	console.log(redlines.fontSize);
	console.log( PRISM.copy)

	redlines.fontType = PRISM.copy[redlines.fontSize] || 'Unknown';

  /// add to panel
  redlines.lineHeight = computed.getPropertyValue('line-height');
  //redlines.letterSpacing = computed.getPropertyValue('letter-spacing');
  redlines.fontFamily = computed.getPropertyValue('font-family');
  redlines.opentype = computed.getPropertyValue('font-feature-settings');

  redlines.font = element.innerText != '' ? 'block' : 'none';

  redlines.hasOpentype = redlines.opentype == 'normal' ? 'none' : 'block';

  //console.log(element.innerText, 'innertext')

  //redlines.fontInfo = redlines['font-size'] + ' ' + redlines['font-color'];
  redlines.borderLeft = bl;
  redlines.borderRight = br;
  redlines.borderTop = bt;
  redlines.borderBottom = bb;
  redlines.borderLeftColor = computed.getPropertyValue('border-left-color');
  redlines.borderRightColor = computed.getPropertyValue('border-right-color');
  redlines.borderTopColor = computed.getPropertyValue('border-top-color');
  redlines.borderBottomColor = computed.getPropertyValue('border-bottom-color');
  redlines.borderRadiusTopLeft = computed.getPropertyValue('border-top-left-radius');
  redlines.borderRadiusTopRight = computed.getPropertyValue('border-top-right-radius');
  redlines.borderRadiusBottomLeft = computed.getPropertyValue('border-bottom-left-radius');
  redlines.borderRadiusBottomRight = computed.getPropertyValue('border-bottom-right-radius');
  redlines.borderColorTop = bt ? computed.getPropertyValue('border-top-color') : null;
  redlines.borderColorRight = br ? computed.getPropertyValue('border-right-color') : null;
  redlines.borderColorBottom = bb ? computed.getPropertyValue('border-bottom-color') : null;
  redlines.borderColorLeft = bl ? computed.getPropertyValue('border-left-color') : null;
  redlines.borderStyleTop = bt ? computed.getPropertyValue('border-top-style') : null;
  redlines.borderStyleRight = br ? computed.getPropertyValue('border-right-style') : null;
  redlines.borderStyleBottom = bb ? computed.getPropertyValue('border-bottom-style') : null;
  redlines.borderStyleLeft = bl ? computed.getPropertyValue('border-left-style') : null;

  redlines.borderColor = redlines.borderColorTop || redlines.borderColorRight || redlines.borderColorBottom || redlines.borderColorLeft || 'transparent';
  redlines.borderSwatch = redlines.borderColor && redlines.borderColor != 'transparent' ? PRISM.whatcolor(redlines.borderColor) : '--';
  redlines.borderColorHex = redlines.borderColor && redlines.borderColor != 'transparent' ? PRISM.rgbtohex(redlines.borderColor) : '--';
  redlines.borderStyle = redlines.borderStyleTop || redlines.borderStyleRight || redlines.borderStyleBottom || redlines.borderStyleLeft || '--';

  redlines.border = redlines.borderLeft || redlines.borderRight  || redlines.borderTop || redlines.borderBottom  ? 'block' : 'none';

  redlines.borderCSS = computed.getPropertyValue('border');

  redlines.borderRadius = redlines.borderRadiusTopLeft != '0px' || redlines.borderRadiusTopRight != '0px' || redlines.borderRadiusBottomLeft != '0px' || redlines.borderRadiusBottomRight != '0px' || redlines.border == 'block' ? 'block' : 'none';
  redlines.borderRadiusCSS = computed.getPropertyValue('border-radius');

  var shadow = computed.getPropertyValue('box-shadow');
  redlines.dropShadow = shadow;

  var boxshadow = shadow != 'none' ? shadow.split('px, ') : [];
  var boxhtml = '';

  for( var i=0;i<boxshadow.length;i++){
    var shadowcolor = boxshadow[i].replace(/px/gi, '');
    var box = shadowcolor.replace(/rgb(.*?)\)/i, '').trim();
    shadowcolor = shadowcolor.replace(box, '');
    box = box.split(' ');

    boxhtml += '<div>';
      boxhtml += '<div class=item><span class=label>Color</span> <span class=value>' + shadowcolor + '</span></div><br>';
      boxhtml += '<div class=item><span class=label>Offset-X</span> <span class=value>' + box[0] + '</span></div>';
      boxhtml += '<div class=item><span class=label>Offset-Y</span> <span class=value>' + box[1] + '</span></div><br>';
      boxhtml += '<div class=item><span class=label>Blur</span> <span class=value>' + box[2] + '</span></div>';
      boxhtml += '<div class=item><span class=label>Spread</span> <span class=value>' + box[3] + '</span></div>';
    boxhtml += '</div>';
  }

  redlines.boxshadow = boxhtml;

  /*var shadow = computed.getPropertyValue('box-shadow');
  var shadowcolor = shadow;
  shadow = shadow.replace(/rgb(.*?)\)/i, '').trim();
  shadowcolor = shadowcolor.replace(shadow, '');
  shadow = shadow.split(' ');

  redlines.shadowColor = shadowcolor;
  redlines.shadowX = shadow[0];
  redlines.shadowY = shadow[1];
  redlines.shadowBlur = shadow[2];
  redlines.shadowSpread = shadow[3];*/

  redlines.paddingLeft = pl;
  redlines.paddingRight = pr;
  redlines.paddingTop = pt;
  redlines.paddingBottom = pb;

  redlines.padding = pl || pr || pt || pb ? 'block' : 'none';

  redlines.marginLeft = ml;
  redlines.marginRight = mr;
  redlines.marginTop = mt;
  redlines.marginBottom = mb;

  redlines.margin = ml || mr || mt || mb ? 'block' : 'none';

  redlines.negitive = [];

  if ( redlines.marginTop < 0 ){
    redlines.negitive.push('inset 0 ' + Math.abs(redlines.marginTop) + 'px rgba(255, 0, 0, 0.5)');
  }
  if ( redlines.marginBottom < 0 ){
    redlines.negitive.push('inset 0 ' + redlines.marginBottom + 'px rgba(255, 0, 0, 0.5)');
  }
  if ( redlines.marginLeft < 0 ){
    redlines.negitive.push('inset ' + Math.abs(redlines.marginLeft) + 'px 0 rgba(255, 0, 0, 0.5)');
  }
  if ( redlines.marginRight < 0 ){
    redlines.negitive.push('inset ' + redlines.marginRight + 'px 0 rgba(255, 0, 0, 0.5)');
  }

  redlines.negitive.join(',');


  console.log(redlines);

  if ( redlines.negitive ){
    wrap.style.boxShadow = redlines.negitive;
    redlines.negitive += ', inset 0 0 0 1px #e1e1e1';
  }



  var template = PRISM.paneltemplate;//document.getElementById('PRISMredlinepaneltemplate').innerHTML;


  template = template.PRISMelemental(redlines);







  // for (var prop in redlines) {
  //   if (!redlines.hasOwnProperty(prop)) {
  //       continue;
  //   }
  //   var d = document.createElement('div')
  //   var t = document.createTextNode(prop + ": " + redlines[prop]);
  //
  //   d.appendChild(t);
  //   panel.appendChild(d);
  // }
  //
  // console.log(redlines);

  /*var s = document.createTextNode(w + " x " + h);
  bounds.appendChild(s);*/

  padding.appendChild(bounds);
  border.appendChild(padding);
  margin.appendChild(border);
  wrap.appendChild(margin);
  superwrap.appendChild(wrap);

  document.body.appendChild(superwrap);




  var panel = document.getElementsByClassName('PRISMredlinepanel')[0];
  if ( !panel ){
    panel = document.createElement('div');
    panel.className = 'PRISMredlinepanel';
    document.body.appendChild(panel);
  }

  panel.innerHTML = template;

  //document.body.classList.remove('PRISMzeplin');


},

 rgbtohex: function(x){
    var rgb = x.match(/\d+/g);
    var a = x.match('rgba');
    if ( !rgb || a ) {
        return x;
    }
    var r = Number(rgb[0]);
    var g = Number(rgb[1]);
    var b = Number(rgb[2]);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toLocaleUpperCase();
},

cssfakie2: function (e){
    console.log('fakie');
    var target = e.target;
    if ( !target || !target.dataset.fakie){
      return;
    }
    var p = target.PRISMup('buttontoggles') || target.parentElement;
    var tabs = target.PRISMup('PRISMtabs') || target.parentElement.parentElement;
    var line = tabs.getElementsByClassName('PRISMline')[0];
    var state = target.dataset.fakie;

    var btns = p.getElementsByClassName('activated');
    var count = btns.length;
    for(var i=0;i<count;i++){
      btns[0].classList.remove('activated')
    }

    target.classList.add('activated');

    var past = document.getElementsByClassName('prismstates');
    var count = past.length;
    for(var i=0;i<count;i++){
      past[0].parentNode.removeChild(past[0]);
    }

    if ( line ){
      var sx = target.offsetWidth;
      var ol = target.offsetLeft;

      if ( ol == 0 ){
        ol = -16
      }

      line.style.transform = 'translateX(' + ol + 'px) scaleX(' + sx + ')';
      console.log('line', ol, sx)
    }

    document.documentElement.classList.remove('prismhover','prismactive','prismfocus', 'prismdisabled');

    if ( !state || state == 'standard' ){
      return;
    }

    var sheets = document.styleSheets;
    var slen = sheets.length;
    var sheet = document.createElement('style');
    sheet.type = 'text/css';
    sheet.id = 'prism' + state;
    sheet.className = 'prismstates';

    console.log(document.styleSheets);


    for(var i=0; i<slen; i++) {
        var rules = document.styleSheets[i];
        if ( !rules || rules.id == 'PRISMMAGICALCSS' || !rules.cssRules || !rules.media || rules.media.mediaText == 'none' ){
          continue;
        }

        console.log(rules.mediaText)
        console.log(rules.media)
        console.log(rules)
        //continue;

        rules = rules.cssRules;


        for(var j=0; j<rules.length; j++) {
          var r = rules[j]
          //console.log(rules[j].selectorText);
          //console.log(r);
          var selector = r.selectorText;
          console.log(selector);
          if ( !selector ){
            continue;
          }

           if(selector.indexOf(':' + state) >= 0) {
               //return rules[j].style[prop];
               var css = r.cssText;

               console.log(css);
               var newclass = selector.replace(':' + state, '');/////FIX TODO @TODO ugh
               //newclass = '.prism' + state + ' ' + newclass;

               console.log(newclass);

               var re = new RegExp(selector, 'g');



               console.log(re);


               css = css.replace(re, newclass);

               console.log(css);

               var rere = new RegExp(',(.*?):' + state, 'g');
               console.log(rere)
               css = css.replace(rere, ', .prism' + state + '$1');

               //console.log(css)

               sheet.appendChild(document.createTextNode(css));

          }
        }
    }

    //console.log(sheet.innerHTML)

    document.body.appendChild(sheet);

    document.documentElement.classList.add('prism' + state);

    console.log('css state: ' + state)
},

paneldrag: function(e){
  var t = e.target;
  if ( t.className !== 'PRISMdrag' || e.which !== 1 ){
    return;
  }

  e.preventDefault();
  e.stopPropagation();

  var panel = t.PRISMup('PRISMredlinepanel')  || element.parentElement.parentElement;

  if ( !panel ){
    return;
  }

  var ox = Number(panel.dataset.x) || 0;
  var oy = Number(panel.dataset.y) || 0;

  var sx = e.pageX - ox;
  var sy = e.pageY - oy;



  function panelmove(e){
    e.preventDefault();
    e.stopPropagation();
    var x = e.pageX;
    var y = e.pageY;

    var nx = x - sx;
    var ny = y - sy;

    panel.style.transform = 'translate(' + nx + 'px,' + ny +'px)';
    panel.dataset.x = nx;
    panel.dataset.y = ny;

  }

  function paneldone(e){
    document.removeEventListener('mousemove', panelmove);
    document.removeEventListener('mouseup', paneldone);
  }

  document.addEventListener('mousemove', panelmove);
  document.addEventListener('mouseup', paneldone);
},



sleep: function (miliseconds) {
    var currentTime = new Date().getTime();
    while (currentTime + miliseconds >= new Date().getTime()) {
    }
},

togglezeplin: function (e){
  if ( !this.classList.contains('on') ){
    document.body.addEventListener('click', PRISM.zeplin, true);
    document.body.addEventListener('mousemove', PRISM.prezep);
    document.body.classList.add('MAGIC', 'PRISMzeplin');
    this.classList.add('on');
  } else {
    document.body.removeEventListener('click', PRISM.zeplin, true);
    document.body.removeEventListener('mousemove', PRISM.prezep);
    document.body.classList.remove('MAGIC', 'PRISMzeplin');
    this.classList.remove('on');
    PRISM.clearpre();
  }
},

clearredlines: function (e){
  var redlines = document.getElementsByClassName('PRISMredline');
  var count = redlines.length;

  for (var i =0;i<count;i++){
    var z = redlines[0];
    z.parentNode.removeChild(z);
  }

  PRISM.clearpre();
},

clearpre: function(){
  var zep = document.getElementsByClassName('PRISMprezeplin');
  var count = zep.length;

  for (var i =0;i<count;i++){
    var z = zep[0];
    z.parentNode.removeChild(z);
  }

  var zepdist = document.getElementsByClassName('PRISMdistance');
  var count = zepdist.length;
  for (var i =0;i<count;i++){
    var z = zepdist[0];
    z.parentNode.removeChild(z);
  }

  var zepdist = document.getElementsByClassName('PRISMdistance2');
  var count = zepdist.length;
  for (var i =0;i<count;i++){
    var z = zepdist[0];
    z.parentNode.removeChild(z);
  }
},

delegate: function (e){
  var t = e.target;

  var events = [
    { item: 'pausezeplin', callback: PRISM.togglezeplin },
    { item: 'clearzeplins', callback: PRISM.clearredlines },
    { item: 'PRISMeject', callback: PRISM.eject },
  ];

  while(t){
    for(var i=0;i<events.length;i++){
      var ev = events[i];

      if ( t.classList.contains(ev.item) || t.id == ev.item || t.tagName == ev.item ){
        ev.callback.call(t, e);
      }
    }

    t = t.parentElement;
  }
},

paneldom: function(){
  // panel
  var info = document.createElement('div');
  info.className = 'infopanel';

  // drag gripper
  var drag = document.createElement('div');
  var handle = document.createElement('div');

  drag.className = 'PRISMdrag';
  handle.className = 'prismhandle';

  for(var i=0;i<6;i++){
    var v = document.createElement('div');
    v.className = 'prismvh';

    handle.appendChild(v);
  }

  drag.appendChild(handle);

  info.appendChild(drag);

  // scrollable
  var scroll = document.createElement('div');
  scroll.className = 'PRISMscroll';

  var controlsub = document.createElement('div');

  constrolsub.className = 'sub controls';

  var togglebtn = document.createElement('button');
  var toggle = document.createElement('div');
  var trackwrap = document.createElement('div');
  var togglehandle = document.createElement('div');
  var togglefillwrap = document.createElement('div');
  var togglefill = document.createElement('div');

  togglebtn.className = 'PRISMpausezeplin pausezeplin on';
  togglebtn.id = 'pausezeplin';
  togglebtn.style.background = "transparent";
  togglebtn.style.marginLeft = "-12px !important";
  togglebtn.title = "Pause redlining (Esc)";

  toggle.className = 'toggle2';
  trackwrap.className = 'trackwrap2';
  togglehandle.className = 'toggle2handle';
  togglefillwrap.className = 'togglefillwrap';
  togglefill.className = 'togglefill';

  togglefillwrap.appendChild(togglefill);
  trackwrap.appendChild(togglehandle);
  trackwrap.appendChild(togglefillwrap);

  toggle.appendChild(trackwrap);

  togglebtn.appendChild(toggle);

  var close = document.createElement('button');
  var clear = document.createElement('button');

  close.className = 'PRISMeject';
  close.style.marginRight = '-8px !important';

  close.appendChild(document.createTextNode('Close'));

  clear.className = 'clearzeplins';
  clear.appendChild(document.createTextNode('Clear'));

  constrolsub.appendChild(togglebtn);
  constrolsub.appendChild(close);
  constrolsub.appendChild(clear);


  scroll.appendChild(controlsub);




  info.appendChild(scroll);

  return info;
},

 paneltemplate :
 `<div class=infopanel>
  <div class=PRISMdrag>
    <div class="prismvhandle">
        <div class="prismvh"></div>
        <div class="prismvh"></div>
        <div class="prismvh"></div>
        <div class="prismvh"></div>
        <div class="prismvh"></div>
        <div class="prismvh"></div>
    </div>
  </div>
  <div class=PRISMscroll>
    <div class=sub style="padding:8px 24px;">
      <button class="PRISMpausezeplin pausezeplin on" id=pausezeplin title="Pause redlining (Esc)" style="background:transparent;margin-left:-12px !important;">
        <div class=toggle2>
            <div class=trackwrap2>
                <div class=toggle2handle></div>
                <div class=togglefillwrap>
                  <div class=togglefill></div>
                </div>
            </div>
        </div>
      </button><button class=PRISMeject style="margin-right:-8px !important;">Close</button><button class=clearzeplins>Clear</button>
    </div>
    <div class=sub style="padding-bottom:0;overflow:visible;">
      <h4>Toggle States (experimental)</h4>
      <div class=PRISMtabs>
        <div class=buttontoggles>
          <button class="fakie fakedefault" style="width:32px;" data-fakie=standard>Off</button><button class="fakie fakehover" data-fakie=hover>Hover</button><button class="fakie fakeactive" data-fakie=active>Active</button><button class="fakie fakefocus" data-fakie=focus>Focus</button><button class="fakie fakedisabled" data-fakie=disabled>Disabled</button>
        </div>
        <div class=PRISMline style="transform:translateX(-16px) scaleX(25)"></div>
      </div>
    </div>
    <div class="sub name">
      <h4 style="margin-bottom:0;">Info</h4>
      <div>
        <div class=item><span class=label>Width</span> <span class=value>{width}px</span></div>
        <div class=item><span class=label>Height</span> <span class=value>{height}px</span></div>
      </div>
      <div class=item style="display:{showopacity}">
        <div class=item><span class=label>Opacity</span> <span class=value>{opacity}</span></div>
      </div>
      <div class=item><span class=label>Type</span>  <span class=value>{elementname}</span></div>
    </div>
    <div class="sub fillinfo" style="display:{fill};">
      <h4>Fill</h4>
      <span class=colorpreview style="margin-bottom:4px;width:100%;height:32px;display:inline-block;background-color:{fillColor};vertical-align:middle;border-radius:2px;box-shadow:0 0 0 1px rgba(0,0,0,.05);"></span>
      <!--<div class=item><span class=label>Swatch</span> <span class=value>{colorInfo}</span></div>-->
      <div class=item><span class=label>RGB</span> <span class=value>{rgbfill}</span></div>
      <div class=item><span class=label>Hex</span> <span class=value>{hexfill}</span></div>
    </div>
    <div class="sub typeinfo" style="display:{font};">
      <h4>Font</h4>
      <span class=fontpreview style="line-height:1;margin-bottom:4px;display:block;background:{fillColor};padding:4px;border-radius:2px;font-size:{font-size};color:{fontRGB};font-weight:{font-weight};vertical-align:middle;box-shadow:0 0 0 1px rgba(0,0,0,.05);min-width: 32px;text-align: center;box-sizing:border-box;">Aa</span><span class=fontvalue>
        <div class=item><span class=label>Typeface</span> <span class=value>{fontFamily}</span></div>
        <div class=item><span class=label>Size</span> <span class=value>{fontSize}</span></div>
        <div class=item><span class=label>Weight</span> <span class=value>{fontWeight}</span></div>
        <!--<div class=item><span class=label>Swatch</span> <span class=value>{fontColor}</span></div>-->
        <div class=item><span class=label>RGB</span> <span class=value>{fontRGB}</span></div>
        <div class=item><span class=label>Hex</span> <span class=value>{fontHex}</span></div>
        <div class=item><span class=label>Line Height</span> <span class=value>{lineHeight}</span></div>
        <div class=item><span class=label>OpenType</span> <span class=value>{opentype}</span></div>
				<div class=item><span class=label>Font Type</span> <span class=value>{fontType}</span></div>
      </span>
    </div>
    <div class="sub borderinfo" style="display:{border};">
      <h4>Border</h4>
      <div style="vertical-align:top;">
        <div class=borderpreview style="width:100%;height:40px;box-sizing:border-box;border-left-width:{borderLeft}px;border-right-width:{borderRight}px;border-bottom-width:{borderBottom}px;border-top-width:{borderTop}px;border-left-color:{borderLeftColor};border-right-color:{borderRightColor};border-top-color:{borderTopColor};border-bottom-color:{borderBottomColor};border-style:{borderStyle};margin-bottom:4px;">
          <span class=borderleft>{borderLeft}</span>
          <span class=borderright>{borderRight}</span>
          <span class=borderbottom>{borderBottom}</span>
          <span class=bordertop>{borderTop}</span>
        </div>
        <div class=info>
          <div class=item><span class=label>Color</span> <span class=value><span style="display:inline-block;height:16px;width:24px;background:{borderColor};border-radius:2px;"></span></span></div>
          <!--<div class=item><span class=label>Swatch</span> <span class=value>{borderSwatch}</span></div>-->
          <div class=item><span class=label>RGB</span> <span class=value>{borderColor}</span></div>
          <div class=item><span class=label>Hex</span> <span class=value>{borderColorHex}</span></div>
          <div class=item><span class=label>Style</span> <span class=value>{borderStyle}</span></div>
        </div>
      </div>
    </div>
    <div class="sub borderinfo" style="display:{borderRadius};">
      <h4>Border Radius</h4>
      <span style="display:inline-block;margin-bottom:4px;margin-left:32px;">
          <div style="border-width:2px;font-size:10px;border-color:#666;border-radius:{borderRadiusTopLeft} 0 0 0;border-style:solid;width:16px;height:16px;white-space:nowrap;box-sizing:border-box;padding:0 0 0 ;display:inline-block;border-right:none;border-bottom:none;margin-right:0;text-align:left;text-indent:-30px;line-height: 0;">{borderRadiusTopLeft}</div><div style="border-width:2px;font-size:10px;border-color:#666;border-radius:0 {borderRadiusTopRight} 0 0;border-style:solid;width:16px;height:16px;white-space:nowrap;box-sizing:border-box;padding:0 0 0 0;text-align:right;text-indent:24px;display:inline-block;border-left:none;border-bottom:none;line-height: 0;">{borderRadiusTopRight}</div>
          <div style="height:0;"></div>
          <div style="border-width:2px;font-size:10px;border-color:#666;border-radius:0 0 0 {borderRadiusBottomLeft};border-style:solid;width:16px;height:16px;white-space:nowrap;box-sizing:border-box;padding:0 0 0 0;text-align:left;text-indent:-30px;display:inline-block;border-top:none;border-right:none;margin-right:0;line-height:24px;">{borderRadiusBottomLeft}</div><div style="border-width:2px;font-size:10px;border-color:#666;border-radius:0 0 {borderRadiusBottomRight} 0;border-style:solid;width:16px;height:16px;width:{radiusHeight};height:{radiusHeight};white-space:nowrap;box-sizing:border-box;padding:0 0 0 0;text-indent: 24px;text-align:right;display:inline-block;border-top:none;border-left:none;line-height:24px;">{borderRadiusBottomRight}</div>
      </span>
      <div class=break></div>
      <div class="item uglify">
        <span class=column>
          <span class=label>Top Left</span> <span class=value>{borderRadiusTopLeft}</span>
        </span>
        <span class=column>
          <span class=label>Top Right</span> <span class=value>{borderRadiusTopRight}</span>
        </span>
      </div>
      <div class="item uglify">
        <span class=column>
          <span class=label>Bottom Left</span> <span class=value>{borderRadiusBottomLeft}</span>
        </span>
        <span class=column>
          <span class=label>Bottom Right</span> <span class=value>{borderRadiusBottomRight}</span>
        </span>
      </div>
    </div>
    <div class="sub dropshadowinfo" style="display:{dropShadow}">
      <h4>Drop Shadow</h4>
      <div style="width:100%;height:40px;box-shadow:{dropShadow};margin-bottom:6px;" title="{dropShadow}"></div>
      {boxshadow}
    </div>
    <div class="sub paddinginfo" style="display:{padding};">
      <h4>Padding</h4>
      <div>
          <div class=paddingpreview style="position:relative;height:40px;border:0 solid rgb(171, 213, 153);box-sizing:content-box;border-left-width:{paddingLeft}px;border-right-width:{paddingRight}px;border-bottom-width:{paddingBottom}px;border-top-width:{paddingTop}px;margin-bottom:16px;">
            <span class=borderleft>{paddingLeft}</span>
            <span class=borderright>{paddingRight}</span>
            <span class=borderbottom>{paddingBottom}</span>
            <span class=bordertop>{paddingTop}</span>
          </div>
          <div class="item uglify">
            <span class=column>
              <span class=label>Top</span> <span class=value>{paddingTop}px</span>
            </span>
            <span class=column>
              <span class=label>Bottom</span> <span class=value>{paddingBottom}px</span>
            </span>
          </div>
          <div class="item uglify">
            <span class=column>
              <span class=label>Left</span> <span class=value>{paddingLeft}px</span>
            </span>
            <span class=column>
              <span class=label>Right</span> <span class=value>{paddingRight}px</span>
            </span>
          </div>
      </div>
    </div>
    <div class="sub spacinginfo" style="display:{margin};">
      <h4>Spacing</h4>
      <div>
          <div class=spacingpreview style="position:relative;height:40px;border:0 solid rgb(252, 199, 143);box-sizing:content-box;border-left-width:{marginLeft}px;border-right-width:{marginRight}px;border-bottom-width:{marginBottom}px;border-top-width:{marginTop}px;box-shadow:{negitive};margin-bottom:16px;">
            <span class=borderleft>{marginLeft}</span>
            <span class=borderright>{marginRight}</span>
            <span class=borderbottom>{marginBottom}</span>
            <span class=bordertop>{marginTop}</span>
          </div>
          <div class="item uglify">
            <span class=column>
              <span class=label>Top</span> <span class=value>{marginTop}px</span>
            </span>
            <span class=column>
              <span class=label>Bottom</span> <span class=value>{marginBottom}px</span>
            </span>
          </div>
          <div class="item uglify">
            <span class=column>
              <span class=label>Left</span> <span class=value>{marginLeft}px</span>
            </span>
            <span class=column>
              <span class=label>Right</span> <span class=value>{marginRight}px</span>
            </span>
          </div>
      </div>
    </div>
    <div class="sub PRISMcss">
      <div>
        <span class=cssclass>{elementname}</span> &nbsp;<span class=bracket>&#123;</span>
      </div>
      <div class=cssitem style="display:{widthCSS}">
        <span class=csskey>width</span>: <span class=cssvalue>{widthCSS}</span>;
      </div>
      <div class=cssitem style="display:{heightCSS}">
        <span class=csskey>height</span>: <span class=cssvalue>{heightCSS}</span>;
      </div>
      <div class=cssitem style="display:{fill}">
        <span class=csskey>background-color</span>: <span class=cssvalue>{hexfill}</span><span class=csscomment style="display:{fillSwatch}"> /* {colorInfo} */</span>;
      </div>
      <div class=cssitem style="display:{font}">
        <span class=csskey>font-size</span>: <span class=cssvalue>{fontSize}</span>;
      </div>
      <div class=cssitem style="display:{font}">
        <span class=csskey>font-weight</span>: <span class=cssvalue>{fontWeight}</span>;
      </div>
      <div class=cssitem style="display:{font}">
        <span class=csskey>color</span>: <span class=cssvalue>{fontHex}</span><span class=csscomment style="display:{fontSwatch}"> /* {fontColor} */</span>;
      </div>
      <div class=cssitem style="display:{font}">
        <span class=csskey>line-height</span>: <span class=cssvalue>{lineHeight}</span>;
      </div>
      <div class=cssitem style="display:{hasOpentype}">
      <span class=csskey>font-feature-settings</span>: <span class=cssvalue>{opentype}</span>;
    </div>
      <div class=cssitem style="display:{padding}">
        <span class=csskey>padding</span>: <span class=cssvalue>{paddingTop}px {paddingRight}px {paddingBottom}px {paddingLeft}px</span>;
      </div>
      <div class=cssitem style="display:{margin}">
        <span class=csskey>margin</span>: <span class=cssvalue>{marginTop}px {marginRight}px {marginBottom}px {marginLeft}px</span>;
      </div>
      <div class=cssitem style="display:{border}">
        <span class=csskey>border</span>: <span class=cssvalue>{borderCSS}</span>;
      </div>
      <div class=cssitem style="display:{borderRadius}">
        <span class=csskey>border-radius</span>: <span class=cssvalue>{borderRadiusCSS}</span>;
      </div>
      <div class=cssitem style="display:{dropShadow}">
        <span class=csskey>box-shadow</span>: <span class=cssvalue>{dropShadow}</span>;
      </div>
      <span class=bracket>&#125;</span>
    </div>
  </div>
</div>
`,

  setup: function (){
    document.body.addEventListener('click', PRISM.zeplin, true);
    document.body.addEventListener('click', PRISM.cssfakie2);

    document.body.addEventListener('mousemove', PRISM.prezep);

    document.body.addEventListener('mousedown', PRISM.paneldrag);

    document.body.addEventListener('click', PRISM.delegate);
    document.addEventListener('keyup', PRISM.keyup);

    window.addEventListener('resize', PRISM.resize);


    document.body.classList.add('PRISMzeplin', 'MAGIC');

    var ugh = window.chrome ? chrome : {};

    var link = document.createElement("link");
    link.href = ugh.extension ? ugh.extension.getURL('styles.css') : 'http://mine.corp.adobe.com/prism/styles.css';
    link.id = 'PRISMMAGICALCSS';
    link.className = 'PRISMMAGICALCSS';
    link.type = "text/css";
    link.rel = "stylesheet";
    link.media = 'all';
    document.getElementsByTagName("head")[0].appendChild(link);

    var panel = document.createElement('div');
    panel.className = 'PRISMredlinepanel';

    var clean = document.documentElement.className.indexOf('adobeclean') > -1;

    if ( clean ){
        panel.className += ' SPECTRUM';
    }

    var temp = PRISM.paneltemplate.PRISMelemental({
      fill : 'none',
      border: 'none',
      borderRadius: 'none',
      font: 'none',
      padding: 'none',
      margin: 'none',
      elementname: 'Window',
      width: window.innerWidth,
      height: window.innerHeight,
      showopacity: 'none',
      dropShadow: 'none',
      hasOpentype: 'none',
      widthCSS: window.innerWidth + 'px',
      heightCSS: window.innerHeight + 'px'
    });
    panel.innerHTML = temp;
    document.body.appendChild(panel);

    // var SPECS = window.open("", "Meow", "width=280,height=480,top=20,left=20");
    // SPECS.document.write(temp);

    PRISM.colormagic();
  },
  colormagic: function(){
    var elements = document.getElementsByTagName("*");
    var array = [];

    meow:
    for(var i=0;i<elements.length;i++){
      var element = elements[i];
      var computed = window.getComputedStyle(element, null);
      var color = computed.getPropertyValue('color');
      var fill = computed.getPropertyValue('background-color');
      var border = computed.getPropertyValue('border-width');
      var b1 = computed.getPropertyValue('border-top-color');
      var b2 = computed.getPropertyValue('border-right-color');
      var b3 = computed.getPropertyValue('border-bottom-color');
      var b4 = computed.getPropertyValue('border-left-color');

      var p = element;

      while( p ){
        var c2 = window.getComputedStyle(p, null);
        var display = c2.getPropertyValue('display');
        var opacity = c2.getPropertyValue('opacity');
        var visible = c2.getPropertyValue('visibility');

        if ( display == 'none' || opacity == 0 || visible == 'hidden' ){
          continue meow;
        }

        p = p.parentElement;
      }

      array.push(fill);

      if ( element.innerText != '' ){
        array.push(color);
      }

      if ( border != '0px' ){
        array.push(b1);
        array.push(b2);
        array.push(b3);
        array.push(b4);
      }
    }

    var count = {};
    var total = 0;

    //var seen = {};
    //var out = [];
    var len = array.length;
    //var j = 0;
    for(var i=0; i<len; i++) {
       var item = array[i];
       /*if(seen[item] !== 1) {
           seen[item] = 1;
           out[j++] = item;
       }*/
       if ( item == 'rgba(0, 0, 0, 0)' ){
         continue;

       }

       count[item] = (count[item]||0)+1;
       total++;

    }
    //console.log(seen);
    //console.log(out);
    //console.log(count);

    var div = document.createElement('div');
    // div.style.position = 'absolute';
    // div.style.top = 0;
    // div.style.left = 0;
    div.className = 'sub';


    var arr = [];
    for (var prop in count) {
        if (count.hasOwnProperty(prop)) {
            arr.push({
                'key': prop,
                'value': count[prop]
            });
        }
    }
    arr.sort(function(a, b) {
        return b.value - a.value;
    });


    for(var i=0;i<arr.length;i++){
      var a = arr[i];
      var percent = Math.round(((a.value/total) * 10000))/100;

      if ( !percent ){
        continue;
      }

      var what = PRISM.whatcolor(a.key);

      if ( !what || what == 'unknown' ){
        what = PRISM.rgbtohex(a.key);
      }

      div.innerHTML += '<div style="width:16px;height:16px;border-radius:0;white-space:nowrap;background-color:' + a.key + ';text-indent:24px;margin:2px 0 6px;float:left;margin:0;" title="' + percent + '% ' + what +'"></div>';//<span style="font-size:12px;color:#999;">' + what + '</span>

    }

    document.getElementsByClassName('PRISMscroll')[0].appendChild(div);
  },
  keyup: function(e){
    if ( e.which === 27 ){
      PRISM.togglezeplin.call(document.getElementsByClassName('PRISMpausezeplin')[0], e);
    }
    return;
  },
  unloadCSS: function (file) {
    var cssNode = document.getElementById(file);
    cssNode && cssNode.parentNode.removeChild(cssNode);
  },

  removeredlines: function (e){
    var panel = document.getElementsByClassName('PRISMredlinepanel');
    var count = panel.length;
    for(var i=0;i<count;i++){
      var r = panel[0];
      r.parentNode.removeChild(r);
    }

    PRISM.clearredlines();
  },
  resize: function(){
    var red = document.getElementsByClassName('PRISMredline')[0];

    if ( !red ){
      return;
    }

    var actualWidth = Math.max( document.body.scrollWidth, document.body.offsetWidth, document.documentElement.clientWidth, document.documentElement.scrollWidth, document.documentElement.offsetWidth );
    var actualHeight = Math.max( document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight );

    red.style.width = actualWidth + 'px';
    red.style.height = actualHeight + 'px';

    PRISM.clearredlines();
  },
  eject: function() {

    window.PRISMhasRun = false;

    console.warn('Prism Deactivated - ' + Date());

    document.body.removeEventListener('click', PRISM.zeplin, true);
    document.body.removeEventListener('click', PRISM.cssfakie2);

    document.body.removeEventListener('mousemove', PRISM.prezep);

    document.body.removeEventListener('mousedown', PRISM.paneldrag);

    document.body.removeEventListener('click', PRISM.delegate);
    document.removeEventListener('keyup', PRISM.keyup);

    window.removeEventListener('resize', PRISM.resize);

    document.body.classList.remove('PRISMzeplin','prismhover','prismactive', 'prismfocus', 'prismdisabled', 'MAGIC');

    PRISM.removeredlines();
    PRISM.unloadCSS('PRISMMAGICALCSS');

    PRISM = {};

    var toggle = document.getElementsByClassName('redlineswitch')[0];
    if ( toggle ){
      toggle.classList.remove('on');
    }

    var btn = document.getElementsByClassName('refract')[0];
    if ( btn ){
      btn.classList.remove('on');
    }

    if ( typeof window.PRISMeject == 'function' ){
      PRISMeject();
    }
  }
};

Object.prototype.PRISMup = function(c) {
    var a = this;
    var x = false;
    while( a ){
        if ( a.classList.contains(c) ){
            x = a;
            break;
        }
        a = a.parentElement
    }
    return x;
};

String.prototype.PRISMelemental = function(o) {
    return this.replace(/{([^{}]*)}/g,
        function (a, b) {
            var r = o[b];
            return typeof r != 'undefined' ? r : '';//a //typeof r === 'string'
        }
    );
};

(function() {

  console.warn(` ██▓███   ██▀███   ██▓  ██████  ███▄ ▄███▓
▓██░  ██▒▓██ ▒ ██▒▓██▒▒██    ▒ ▓██▒▀█▀ ██▒
▓██░ ██▓▒▓██ ░▄█ ▒▒██▒░ ▓██▄   ▓██    ▓██░
▒██▄█▓▒ ▒▒██▀▀█▄  ░██░  ▒   ██▒▒██    ▒██
▒██▒ ░  ░░██▓ ▒██▒░██░▒██████▒▒▒██▒   ░██▒
▒▓▒░ ░  ░░ ▒▓ ░▒▓░░▓  ▒ ▒▓▒ ▒ ░░ ▒░   ░  ░
░▒ ░       ░▒ ░ ▒░ ▒ ░░ ░▒  ░ ░░  ░      ░
░░         ░░   ░  ▒ ░░  ░  ░  ░      ░
            ░      ░        ░         ░
                                          `);
  console.warn('Activated - ' + Date());

  PRISM.setup();
})();
