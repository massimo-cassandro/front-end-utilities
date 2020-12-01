/* globals ClassicEditor */

/*
  FILE DA INCLUDERE per l'utilizzo di ckeditor
*/

export default function (loader_options) {

  const default_options = {
    cke_url: '/assets/ckeditor-dist/m-ckeditor-min.js',
    upl_url: '/ckeditor/file-uploader',
    img_viewer: '/viewer/'  // (visualizzaione dei file da db, NB: con slash finale)
  };


  const editor_list = document.querySelectorAll('textarea.editor');


  let cke_opts = Object.assign({}, default_options, loader_options || {});

  if (editor_list.length) {

    // Istanza ckeditor.
    // L'istanza è raggiungibile tramite il suo id (se esiste)
    // o, in sua mancanza, tramite l'indice dell'elemento
    // es: ckeditor_instances.__textarea_id__
    window.ckeditor_instances = {};

    const std_toolbar = [
        'heading',
        '|',
        'bold',
        'italic',
        'link',
        '|',
        'alignment:left', 'alignment:center', 'alignment:right', 'alignment:justify',
        '|',
        'outdent', 'indent',
        '|',
        'bulletedList',
        'numberedList',
        '|',
        'imageUpload',
        'blockQuote',
        'insertTable',
        'undo',
        'redo'
      ],

      lite_toolbar = [
        'heading',
        '|',
        'bold',
        'italic',
        'link',
        '|',
        'alignment:left', 'alignment:center', 'alignment:right', 'alignment:justify',
        '|',
        'outdent', 'indent',
        '|',
        'bulletedList',
        'numberedList',
        '|',
        //'imageUpload',
        'blockQuote',
        'insertTable',
        'undo',
        'redo'
      ],

      xlite_toolbar = [
        'heading',
        '|',
        'bold',
        'italic',
        'link',
        '|',
        'alignment:left', 'alignment:center', 'alignment:right', 'alignment:justify',
        '|',
        'outdent', 'indent',
        '|',
        'bulletedList',
        'numberedList',
        '|',
        //'imageUpload',
        'blockQuote',
        //'insertTable',
        'undo',
        'redo'
      ],

      img_plugins = ['mUploadAdapter', 'ImageUpload', 'Image', 'ImageToolbar', 'ImageStyle', 'ImageUpload', 'ImageCaption'],
      table_plugins = ['insertTable', 'Table', 'TableToolbar', 'TableProperties', 'TableCellProperties'],
      headings_plugins = ['Heading'];

    let script = document.createElement('script');
    script.onload =  () => {

      editor_list.forEach(function (item, idx) {

        let options = {
          uploaderUrl: cke_opts.upl_url,
          uploadMaxSize : 4 * 1024 * 1024,
          imgViewer: cke_opts.img_viewer,
          toolbar: std_toolbar
        };

        // max size da attributo data
        if(item.dataset.ckeUplMaxSize) { // in bytes
          options.uploadMaxSize = item.dataset.ckeUplMaxSize;
        }

        // https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/configuration.html#removing-features
        if (item.classList.contains('editor-lite')) {
          options = {
            toolbar: lite_toolbar,
            removePlugins: img_plugins,
          };
        } else if(item.classList.contains('editor-xlite')) {
          options = {
            toolbar: xlite_toolbar,
            removePlugins: img_plugins.concat(table_plugins),
          };
        }

        if(item.classList.contains('editor-no-headings')) {
          options.toolbar = options.toolbar.filter(item => item !== 'heading');
          options.removePlugins = options.removePlugins.concat(headings_plugins);
        }

        // rimozione eventuali separatori all'inizio e alla fine
        if(options.toolbar[0] === '|') {
          options.toolbar = options.toolbar.slice(1);
        }
        if(options.toolbar.slice(-1) === '|') {
          options.toolbar = options.toolbar.slice(0, -1);
        }

        // console.log(options);

        ClassicEditor.create(item, options)



        // .then( editor => {
        //   /* eslint-disable */
        //   console.groupCollapsed();
        //   console.log('textarea',  item );
        //   console.log('editor',  editor );
        //   console.log('toolbar elements',Array.from( editor.ui.componentFactory.names() ));
        //   console.log('plugins', ClassicEditor.build.plugins.map( plugin => plugin.pluginName ));
        //   console.groupEnd();
        //   /* eslint-enable */
        // })

          .then( editor => {
            if(item.disabled) {
              editor.isReadOnly = true;
            }
            window.ckeditor_instances[item.id ? item.id : idx] = editor;

            // abilita eventuali elementi disabilitati con attributo `data-enable="editor"`
            document.querySelectorAll('[data-enable="editor"]:disabled').forEach( el => {
              el.disabled = false;
              el.closest('.form-group').classList.remove('disabled');
            });
          })
          .catch( error => {
            /* eslint-disable */
            console.group('textarea ' + idx);
            console.error(error);
            console.log('textarea',  item );
            console.groupEnd();
            /* eslint-enable */
          });

      }); // end forEach

    }; // end onload

    script.src = cke_opts.cke_url;
    script.type = 'text/javascript';
    document.head.appendChild(script);

  } // end if( editor_list.length

}
