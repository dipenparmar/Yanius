var count = 0;
var blockUpdate = false;
var files = [];
var timezone = moment.tz.guess();
moment.locale(window.navigator.language);

function hideLoader() {
  $('#loader').addClass('hide');
  $('#spinner').addClass('hide');
}
function showLoader() {
  $('#spinner').removeClass('hide');
}

function appendFile(file) {
  let htmlElement = $(
    '<li class="collection-item avatar">' +
    '<i class="material-icons circle teal darken-3">insert_drive_file</i>' +
    '<span class="title blue-grey-text">' + file.originalName + '</span>' +
    '<span class="grey-text"> (' + file.mime + ')</span>' +
    '<p class="grey-text">' + moment(file.timestamp).tz(timezone).format('l LTS') + '</p>' +
    '<p class="grey-text">' + file.views + ' Views</p>' +
    '<div class="secondary-content">' +
    '<a class="pointer" onclick="deleteFile(\'' + file.id + '\', false)">' +
    '<i class="material-icons red-text">delete</i></a>' +
    '<a class="pointer" target="_blank" href="/' + file.shortName + '"><i class="material-icons teal-text darken-3">file_download</i>' +
    '</a></div></li>');
  $('#filelist').append(htmlElement);
}

function loadFiles() {
  let url = window.fileAPIurl + '?index=' + count + '&max=25';
  $.ajax({
    url: url
  }).done(function (data) {
    if (Object.prototype.toString.call(data) !== '[object Array]') return;
    data.forEach(function (element) {
      count++;
      files.push(element);
      appendFile(element);
    });
    hideLoader();
  });
}

function loadMore() {
  if (blockUpdate) return;
  blockUpdate = true;
  showLoader();
  loadFiles();
  setTimeout(function () {
    blockUpdate = false;
  }, 2000);
}

function deleteFile(id, confirm) {
  let file = findById(id);
  if (confirm) {
    let url = '/api/file/' + id;
    $.ajax({
      url: url,
      type: 'DELETE'
    }).done(function (response) {
      Materialize.toast(response.message, 5000);
    });
  } else {
    $('#modalcontent').html(
      '<h4>Delete File</h4>' +
      '<p>Are you sure that you want to delete the file <strong>\'' + file.originalName + '\'</strong>?</p>'
    );
    $('#modalfooter').html(
      '<a onclick="$(\'#modal\').closeModal()" class="modal-action modal-close waves-effect waves-light btn-flat">Cancel</a>' +
      '<a onclick="deleteFile(\'' + id + '\', true)" class="modal-action modal-close waves-effect waves-light red-text btn-flat">Delete</a>'
    );
    $('#modal').openModal();
  }
}

function findById(id) {
  return files.find(function (file) {
    return file.id === id;
  });
}

loadFiles();