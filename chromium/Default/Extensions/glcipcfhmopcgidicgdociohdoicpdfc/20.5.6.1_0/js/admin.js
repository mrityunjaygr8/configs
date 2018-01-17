const style = `
  <style type="text/css">
    img, button {
      cursor: pointer;
    }
    
    .admin-pop .imageWrapper {
      width: 200px;
      height: 150px;
      float: left;
      margin-left: 30px;
    }
    
    .admin-pop img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .admin-pop {
      z-index: 10002;
      top: 5vh;
      left: 50%;
      margin-left: -525px;
      width: 970px;
      height: 620px;
      padding: 110px 25px 70px 25px;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAABECAYAAAA4E5OyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTExIDc5LjE1ODMyNSwgMjAxNS8wOS8xMC0wMToxMDoyMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1OWViM2M2My1mYjA3LTRiYWQtOTQzNS00MGFiMWU2MTc4ZjAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjIwNkRCRjM5M0I3MTFFNTg0RkRCQjRGMDBGQ0Y1QzQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjIwNkRCRjI5M0I3MTFFNTg0RkRCQjRGMDBGQ0Y1QzQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDplZWM4MTY4Ny0yNTU0LTQ1NmMtODdiZi1jMzg1YTc5ZjE3ZTgiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo1OGViODU0Yy03NTcxLTExNzgtOTgx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) no-repeat center 40px #fff;
      background-size: 46px;
      border-radius: 4px;
      position: fixed;
      border: 0;
      box-shadow: 0 10px 60px rgba(0,0,0,0.4);
      text-align: center;
      color: rgba(24,25,27,0.7);
      font-size: 18px;
      font-weight: 300;
    }
    
    .admin-pop button {
      height: 60px;
      line-height: 60px;
      border-radius: 3px;
      color: #fff;
      text-decoration: none;
      margin: 0;
      padding: 20px;
      border: 0;
      font: inherit;
      font-size: 100%;
      vertical-align: baseline;
    }
    
    .admin-pop h4 {
      line-height: 1.5em;
    }
    
    .admin-pop .muzli-admin-delete {
      margin-right: 5px;
      background: #823c3c;
    }
    
    .admin-pop .muzli-admin-show {
      margin-left: 5px;
      background: #487148;
    }
    
    .admin-pop .muzli-admin-hide {
      margin-left: 5px;
      background: #823c3c;
    }
    
    .admin-pop .muzli-admin-nsfw-enable, .admin-pop .muzli-admin-trigger-virality {
      margin: 10px auto auto;
      padding: 20px 40px;
      display: block;
      background: #487148;
    }
    
    .admin-pop .muzli-admin-nsfw-disable {
      margin: 10px auto auto;
      padding: 20px 40px;
      display: block;
      background: #476147;
    }
    
    .admin-pop input {
      width: 70%;
      padding: 8px;
      border: 1px solid #bbb;
      margin-right: 10px;
    }
    
    .admin-pop .muzli-admin-btn-update {
      height: 40px;
      height: 25px;
      font-size: 12px;
      background: #823c3c;
      padding: 0 5px;
    }
    
    .admin-pop .muzli-admin-remove-s3, .admin-pop .muzli-admin-trigger-s3, .admin-pop .muzli-admin-trigger-screenshot {
      background: #823c3c;
      height: 40px;
      padding: 0 5px;
    }
}
  </style>
  
`;

const server = window.MUZLI_ADMIN_SERVER || 'https://admin.muz.li';

const html = `
    <div class="admin-pop">
    </div>
`;

const headers = new Headers({
  'Content-Type': 'application/json'
});

function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}

setTimeout(function () {

  function show(id, data) {
    
    var s3 = `https://files.muzli.space/${data.id}${data.s3 && typeof data.s3 === 'string' ? ('.' + data.s3) : ''}`;
    
    pop.html(`
        <div>
          <div class="imageWrapper">
            <img src="${data.image}"/>
          </div>
          ${id}<br/><br/>
          Link: <a href="${data.link}" target="_blank">${data.link}</a><br/>
          <br/>
          <div style="clear: both; margin-bottom: 20px"></div>
        </div>
        <div style="float: left; width: 50%">
            <input type="text" name="postImageUrl" value="${data.image}" placeholder="Image URL"/><button name="postImageUrl" class="muzli-admin-btn-update">Update</button>
            <br/>
            <br/>
            <input type="text" name="postTitle" value="${data.title}" placeholder="Title"/><button name="postTitle" class="muzli-admin-btn-update">Update</button>
            <br/>
            <br/>
            <input type="text" name="postGif" value="${data.gif || ''}" placeholder="Gif"/><button name="postGif" class="muzli-admin-btn-update">Update</button>
            <br/>
            <br/>
            <input type="text" name="postYoutube" value="${data.youtube || ''}" placeholder="Youtube"/><button name="postYoutube" class="muzli-admin-btn-update">Update</button>
            <br/>
            <br/>
            <input type="text" name="postVimeo" value="${data.vimeo || ''}" placeholder="Vimeo"/><button name="postVimeo" class="muzli-admin-btn-update">Update</button>
            <br/>
            <br/>
          `
      + '<button class="muzli-admin-delete">Delete</button>'
      + (data.hidden ? '<button class="muzli-admin-show">Show</button>' : '<button class="muzli-admin-hide">Hide</button>')
      + (data.nsfw ? '<button class="muzli-admin-nsfw-disable">Disable NSFW</button>' : '<button class="muzli-admin-nsfw-enable">Enable NSFW</button>')
      + '<button class="muzli-admin-trigger-virality">Virality</button>'
      + `
        </div>
        <div style="float: left; width: 50%; text-align: left">
            Source: ${data.source}                    
            <br/><br/>Created: ${data.created}
            <br/><br/>Date: ${data.date}
            <br/><br/>Clicks: ${data.clicks}
            <br/><br/>Facebook: ${data.facebook}, Google: ${data.google}, LinkedIn: ${data.linkedIn} 
            <br/><br/>Pinterest: ${data.pinterest}, Pocket: ${data.pocket}, Reddit: ${data.reddit}
            <br/><br/>Stumbleupon: ${data.stumbleupon}, VK: ${data.vk}, Buffer: ${data.buffer}
            <br/><br/>S3: ${data.s3 ? `<a href="${s3}" target="_blank">Open</a>`:  'No'} 
            ${data.s3 ? '<button class="muzli-admin-remove-s3">Remove</button>' : ''}
            <button class="muzli-admin-trigger-s3">Resize</button>
            <button class="muzli-admin-trigger-screenshot">Screenshot</button>
         </div>
    `);

    const form = JSON.stringify({
      id: id
    });

    pop.find('img').click(() => {
      window.open(data.image)
    })

    pop.find('.muzli-admin-show').click(() => {
      fetch(server + '/feed/p/show', {
        method: "POST",
        body: form,
        headers: headers,
        credentials: 'include',
      })
        .then(status)
        .then(() => {
          alert('success');
          data.hidden = false;
          show(id, data);
        }).catch(() => {
        alert('error');
      });
    });

    pop.find('.muzli-admin-hide').click(() => {
      fetch(server + '/feed/p/hide', {
        method: "POST",
        body: form,
        headers: headers,
        credentials: 'include',
      })
        .then(status)
        .then(() => {
          alert('success');
          data.hidden = true;
          show(id, data);
        }).catch(() => {
        alert('error');
      });
    });

    pop.find('.muzli-admin-delete').click(() => {
      fetch(server + '/feed/p', {
        method: "DELETE",
        body: form,
        headers: headers,
        credentials: 'include',
      })
        .then(status)
        .then(() => {
          alert('success');
          pop.find('button').remove();
        }).catch(() => {
        alert('error');
      });
    });

    pop.find('.muzli-admin-nsfw-enable').click(() => {
      fetch(server + '/feed/p', {
        method: "POST",
        body: JSON.stringify({
          id: id,
          data: {
            nsfw: true
          }
        }),
        headers: headers,
        credentials: 'include',
      })
        .then(status)
        .then(() => {
          alert('success');
          data.nsfw = true;
          show(id, data);
        }).catch(() => {
        alert('error');
      });
    });

    pop.find('.muzli-admin-nsfw-disable').click(() => {
      fetch(server + '/feed/p', {
        method: "POST",
        body: JSON.stringify({
          id: id,
          data: {
            nsfw: false
          }
        }),
        headers: headers,
        credentials: 'include',
      })
        .then(status)
        .then(() => {
          alert('success');
          data.nsfw = false;
          show(id, data);
        }).catch(() => {
        alert('error');
      });
    });

    pop.find('.muzli-admin-btn-update[name="postImageUrl"]').click(() => {
      var image = pop.find('input[name="postImageUrl"]').val();
      if (!image) {
        image = null
      }

      fetch(server + '/feed/p', {
        method: "POST",
        body: JSON.stringify({
          id: id,
          data: {
            image: image
          }
        }),
        headers: headers,
        credentials: 'include',
      })
        .then(status)
        .then(() => {
          alert('success');
          data.image = image;
          show(id, data);
        }).catch(() => {
        alert('error');
      });
    });

    pop.find('.muzli-admin-btn-update[name="postTitle"]').click(() => {
      var title = pop.find('input[name="postTitle"]').val();
      if (!title) {
        return;
      }

      fetch(server + '/feed/p', {
        method: "POST",
        body: JSON.stringify({
          id: id,
          data: {
            title: title
          }
        }),
        headers: headers,
        credentials: 'include',
      })
        .then(status)
        .then(() => {
          alert('success');
          data.title = title;
          show(id, data);
        }).catch(() => {
        alert('error');
      });
    });

    pop.find('.muzli-admin-btn-update[name="postGif"]').click(() => {
      var gif = pop.find('input[name="postGif"]').val() || null;

      fetch(server + '/feed/p', {
        method: "POST",
        body: JSON.stringify({
          id: id,
          data: {
            gif: gif
          }
        }),
        headers: headers,
        credentials: 'include',
      })
        .then(status)
        .then(() => {
          alert('success');
          data.gif = gif;
          show(id, data);
        }).catch(() => {
        alert('error');
      });
    });

    pop.find('.muzli-admin-btn-update[name="postVimeo"]').click(() => {
      var vimeo = pop.find('input[name="postVimeo"]').val() || null;

      fetch(server + '/feed/p', {
        method: "POST",
        body: JSON.stringify({
          id: id,
          data: {
            vimeo: vimeo
          }
        }),
        headers: headers,
        credentials: 'include',
      })
        .then(status)
        .then(() => {
          alert('success');
          data.vimeo = vimeo;
          show(id, data);
        }).catch(() => {
        alert('error');
      });
    });

    pop.find('.muzli-admin-btn-update[name="postYoutube"]').click(() => {
      var youtube = pop.find('input[name="postYoutube"]').val() || null;

      fetch(server + '/feed/p', {
        method: "POST",
        body: JSON.stringify({
          id: id,
          data: {
            youtube: youtube
          }
        }),
        headers: headers,
        credentials: 'include',
      })
        .then(status)
        .then(() => {
          alert('success');
          data.youtube = youtube;
          show(id, data);
        }).catch(() => {
        alert('error');
      });
    });

    pop.find('.muzli-admin-remove-s3').click(() => {

      fetch(server + '/feed/p', {
        method: "POST",
        body: JSON.stringify({
          id: id,
          data: {
            s3: false
          }
        }),
        headers: headers,
        credentials: 'include',
      })
        .then(status)
        .then(() => {
          alert('success');
          data.s3 = false;
          show(id, data);
        }).catch(() => {
        alert('error');
      });
    });

    pop.find('.muzli-admin-trigger-s3').click(() => {

      fetch(server + '/feed/p', {
        method: "POST",
        body: JSON.stringify({
          id: id,
          data: {
            triggeredImageUpload: new Date()
          }
        }),
        headers: headers,
        credentials: 'include',
      })
        .then(status)
        .then(() => {
          alert('success');
          show(id, data);
        }).catch(() => {
        alert('error');
      });
    });

    pop.find('.muzli-admin-trigger-screenshot').click(() => {

      fetch(server + '/feed/p', {
        method: "POST",
        body: JSON.stringify({
          id: id,
          data: {
            triggeredScreenshot: new Date()
          }
        }),
        headers: headers,
        credentials: 'include',
      })
        .then(status)
        .then(() => {
          alert('success');
          show(id, data);
        }).catch(() => {
        alert('error');
      });
    });

    pop.find('.muzli-admin-trigger-virality').click(() => {

      fetch(server + '/api/p/virality/' + id, {
        method: "POST",
        headers: headers,
        credentials: 'include',
      })
        .then(status)
        .then(() => {
          alert('success');
        }).catch(() => {
        alert('error');
      });
    });
  }

  function showOverlay(id) {
    
    pop.show();
    body.addClass('overlay');
    
    pop.html(`
      ${id}
      <br/><br/><br/><br/><br/>
      Loading...
    `);

    overlay.show();

    fetch(server + '/feed/p/item/' + id, {
      headers: headers,
      credentials: 'include',
    }).then((res) => {
      return res.json();
    }).then((data) => {
      show(id, data);
    });
  }


  var body = $(document.body);
  var overlay = $('#overlay');
  var pop = $(html);

  $(document.head).append(style);
  body.append(pop);

  pop.hide();
  $(document).on('click', function () {
    if (event.shiftKey) {
      pop.hide();
      overlay.hide();
    }
  });

  $(document).on('click', 'section li', function (event) {
    if (event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();
      showOverlay($(this).data('muzli-id'));
    }
  });
}, 1000);
