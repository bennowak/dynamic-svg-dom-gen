// Create namespace constants
const svgns = 'http://www.w3.org/2000/svg';
const xmlns = 'http://www.w3.org/2000/xmlns/'
const xlinkns = 'http://www.w3.org/1999/xlink';
// Request variables
let requestPath = 'assets/socialsvg/';
let requestURL = requestPath + 'svg01.json';
let request = new XMLHttpRequest();

// Activate XHR
request.open('GET', requestURL);
request.responseText = 'json';
request.send();
// Process JSON object after loading finished
request.onload = function () {
  // Get JSON in usable variable
  let svgJSON = request.response;
  svgJSON = JSON.parse(svgJSON);

  // Create div container for SVG element
  let svgSpan = document.createElement('span');
  svgSpan.setAttribute('id', svgJSON.div_class);
  let svgObj = document.createElement('object');
  svgObj.setAttribute('type', 'image/svg+xml');

  // Create SVG element
  const svgElement = document.createElementNS(svgns, 'svg');
  svgSpan.append(svgElement);
  // svgSpan.append(svgObj);
  // svgObj.append(svgElement);

  // Set SVG attributes; NOTE: setAttributeNS will cause rendering to fail!!!
  svgElement.setAttribute('xmlns', svgns);
  svgElement.setAttribute('xmlns:xlink', xlinkns);
  svgElement.setAttribute('id', svgJSON.svg_id);
  svgElement.setAttribute('data-name', svgJSON.svg_data_name);
  svgElement.setAttribute('width', svgJSON.svg_width);
  svgElement.setAttribute('height', svgJSON.svg_height);
  svgElement.setAttribute('viewBox', svgJSON.svg_viewBox);
  svgElement.setAttribute('preserveAspectRatio', 'xMinYMin meet');

  // Create SVG title element
  const svgTitle = document.createElementNS(svgns, 'title');

  // Add title element to SVG element
  svgElement.append(svgTitle);
  svgTitle.innerHTML = svgJSON.title;

  // Create SVG defs element
  const svgDefs = document.createElementNS(svgns, 'defs');

  // Generate SVG clipPath elements and add to SVG defs element
  svgJSON.clippingPaths.forEach(clippingPath => {
    svgDefs.append(getClipPath(clippingPath, svgJSON.svg_width, svgJSON.svg_height));
  });

  // Add defs element to SVG element
  svgElement.append(svgDefs);

  // Create SVG image element
  const svgImage = document.createElementNS(svgns, 'image');

  // Set SVG image element attributes
  svgImage.setAttribute('xlink:href', requestPath + svgJSON.image.xlink_href);
  svgImage.setAttribute('href', requestPath + svgJSON.image.xlink_href);
  svgImage.setAttribute('id', svgJSON.image.id);
  svgImage.setAttribute('x', svgJSON.image.x);
  svgImage.setAttribute('y', svgJSON.image.y);
  svgImage.setAttribute('width', svgJSON.image.width);
  svgImage.setAttribute('height', svgJSON.image.height);
  svgImage.setAttribute('clip-path', 'url(#out)');

  // Add image to SVG element
  svgElement.append(svgImage);

  // Add SVG element to <footer>
  document.querySelector("footer").append(svgSpan);

  // Add mouseover event handler
  svgSpan.addEventListener('mouseover', function () {
    svgElement.querySelector("image").setAttribute('clip-path', 'url(#over)');
    console.log(svgElement.querySelector("image"));
  });

  // Add mouseout event handler
  svgSpan.addEventListener('mouseout', function () {
    svgElement.querySelector("image").setAttribute('clip-path', 'url(#out)');
    console.log(svgElement.querySelector("image"));
  });
}

function getClipPath(path, width, height) {
  const svgMask = document.createElementNS(svgns, 'clipPath');
  svgMask.setAttribute('id', path.id);
  svgMask.setAttribute('x', '0');
  svgMask.setAttribute('y', '0');
  svgMask.setAttribute('width', '100%');
  svgMask.setAttribute('height', '100%');
  path.paths.forEach(path => {
    let maskPath = document.createElementNS(svgns, 'path');
    maskPath.setAttribute('fill', path.fill);
    maskPath.setAttribute('d', path.d);
    svgMask.append(maskPath);
  });
  return svgMask;
}