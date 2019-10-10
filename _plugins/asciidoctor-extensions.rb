require 'net/http'
require 'time'

require 'asciidoctor/extensions'

require 'sqlite3'

$PROJECT_ROOT = File.dirname(File.dirname(__FILE__))
$PROJECT_OUT_DIR = File.join $PROJECT_ROOT, 'out'
FileUtils.mkdir_p $PROJECT_OUT_DIR
$PROJECT_AUTOGEN_DIR = File.join $PROJECT_ROOT, 'generated'
FileUtils.mkdir_p $PROJECT_AUTOGEN_DIR

def root_relpath path
  f = Pathname.new(path).relative_path_from($PROJECT_ROOT)
  File.basename(f,File.extname(f))
end

def sqlite3_table_exists db, table
  not db.execute(<<~SQL
    SELECT name
    FROM sqlite_master
    WHERE type='table'
    AND name='#{table}'
    SQL
  ).empty?
end

# xref2 cross reference database.
$XREF2_FAIL_ON_MISSING_REF = ENV['CIROSANTILLI_COM_XREF2_FAIL_ON_MISSING_REF'] == '1'
$XREF2_SERVERLESS = ENV['CIROSANTILLI_COM_XREF2_SERVERLESS'] == '1'
$XREF2_SINGLE_FILE_OUTPUT = ENV['CIROSANTILLI_COM_SINFLE_FILE'] == '1'
if $XREF2_SERVERLESS
  $XREF2_SERVERLESS_EXT = '.html'
else
  $XREF2_SERVERLESS_EXT = ''
end
$XREF2_DB_PATH = File.join($PROJECT_OUT_DIR, 'db.sqlite')
$XREF2_DB = SQLite3::Database.new $XREF2_DB_PATH
$XREF2_DB_TABLE_NAME = 'sections'
$XREF2_DB_INCLUDE_TABLE_NAME = 'includes'
# The extension this character for for all OSes.
$XREF2_PATH_SEPARATOR = '/'
# Check if table exists and create it if it doesn't.
# TODO also check if DB schema changed and also delete if yes.
if not sqlite3_table_exists $XREF2_DB, $XREF2_DB_TABLE_NAME
  # global_index: for each element type (section, image, etc.)
  # this is the Nth occurence of that element in the entire document
  $XREF2_DB.execute <<~SQL
    CREATE TABLE '#{$XREF2_DB_TABLE_NAME}' (
      path TEXT,
      id TEXT,
      title TEXT,
      xrefstyle_full TEXT,
      context TEXT,
      global_index INT,
      level INT
    );
  SQL
end
if not sqlite3_table_exists $XREF2_DB, $XREF2_DB_INCLUDE_TABLE_NAME
  $XREF2_DB.execute <<~SQL
    CREATE TABLE '#{$XREF2_DB_INCLUDE_TABLE_NAME}' (
      path TEXT,
      id TEXT,
      global_index INT
    );
  SQL
end

def xref2_insert_into_db path, id, title, xrefstyle_full, context, global_index, level
  $XREF2_DB.execute "INSERT INTO #{$XREF2_DB_TABLE_NAME} VALUES (?, ?, ?, ?, ?, ?, ?)",
              [path, id, title, xrefstyle_full, context, global_index, level]
end

$OFFLINE_DOWNLOAD = ENV['CIROSANTILLI_COM_OFFLINE_DOWNLOAD']
$OFFLINE_USE = ENV['CIROSANTILLI_COM_OFFLINE_USE']
def offline_download_if_new target, basename
  uri = URI(target)
  file_path = File.join $OFFLINE_DIR, basename
  req = Net::HTTP::Get.new(uri)
  if File.file?(file_path)
    req['If-Modified-Since'] = File.stat(file_path).mtime.rfc2822
  end
  res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == 'https') {|http|
    http.request(req)
  }
  if res.is_a? Net::HTTPSuccess
    File.open(file_path, 'w') {|io|
      io.write res.body
    }
  end
end

## Wikimedia stuff.

$WIKIMEDIA_FILE_URL = 'https://commons.wikimedia.org/wiki/File:'

def wikimedia_automatic_source basename_no_pixels
  $WIKIMEDIA_FILE_URL + basename_no_pixels
end

# Create an image with ID and title derived from the basename of the figure.
#
# Usage:
#
# ....
# image2::
# ....
#
# The image is also a link to its own id.
#
# The ID and title are derived in a way that plays nicely with Wikimedia images,
# which during upload convert underscores to spaces:
#
# * title: derived from image basename, e.g.: 'Asdf qwer_zx-cv -> 'asdf-qwer-zx-cv'
# * ID: derived from title e.g.: 'Asdf qwer zx-cv -> 'image-asdf-qwer-zx-cv'
# * link: points to its own id
#
# Extra optional attributes:
#
# * `source`: a link to the source of the image as a form of attribution and to allow
#   downloading possibly higher resolution versions of the image on Wikimedia
#
# Certain domains are automatically recognized, e.g. Wikimedia Commons, and extra magic
# is done for them, e.t.:
#
# The image source is automatically derived from the image URL, e.g.:
#
# ....
# https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/River_water_sample_collection_swans.jpg/640px-River_water_sample_collection_swans.jpg
# ....
#
# has source:
#
# ....
# https://commons.wikimedia.org/wiki/File:River_water_sample_collection_swans.jpg
# ....
#
# And pixel size prefixes are removed from basenames, e.g.:
#
# ....
# https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/River_water_sample_collection_swans.jpg/640px-Rive_water_sample_collection_swans.jpg
# ....
#
# becomes:
#
# ....
# some-file-name
# ....
class MetadataFromBasenameBlockProcessor < Asciidoctor::Extensions::BlockMacroProcessor
  use_dsl

  def process parent, target, attrs
    known_domain_type = nil
    if target =~ /^https?:\/\//
      if target.start_with?('https://upload.wikimedia.org/wikipedia/commons/')
        known_domain_type = :wikimedia_commons
      end
    else
      target = parent.document.attributes['cirosantilli-media-prefix'] + target
    end
    basename_no_pixels = remove_pixels(File.basename(target), known_domain_type)
    basename_noext = File.basename(basename_no_pixels, File.extname(basename_no_pixels))
    if $OFFLINE_USE
      target_abspath = URI.escape(File.join($PROJECT_AUTOGEN_DIR, basename_no_pixels), '?')
      current_path = parent.document.attributes['docfile']
      attrs['target'] = Pathname.new(target_abspath).relative_path_from(current_path).to_s
    else
      attrs['target'] = target
    end

    if attrs.has_key? 'title'
      title = attrs['title']
    else
      title = basename_noext.gsub(/_+/, ' ')
    end
    title_nosource = title

    # Add source to title.
    source = nil
    if attrs.has_key? 'source'
      source = attrs['source']
    else
      if known_domain_type == :wikimedia_commons
        source = wikimedia_automatic_source basename_no_pixels
      end
    end
    if source
      title += ". link:++#{source}++[Source]."
    end

    if attrs.has_key? 'id'
      id = attrs['id']
    else
      id = id_prefix + '-' + title_nosource.gsub(/[^a-zA-Z0-9]+/, '-').downcase
    end

    if !attrs.has_key? 'link'
      attrs['link'] = '#' + id
    end

    if !attrs.has_key? 'height'
      attrs['height'] = '400'
    end

    attrs['id'] = id
    attrs['title'] = title

    # Download resources for offline usage if requested.
    # https://stackoverflow.com/questions/1509063/how-to-get-a-remote-files-mtime-before-downloading-it-in-ruby/58254786#58254786
    if $OFFLINE_DOWNLOAD
      offline_download_if_new target, basename_no_pixels
    end

    cirosantilli_create_block parent, attrs
  end

  def cirosantilli_create_block parent, attrs
    raise 'unimplemented'
  end

  def id_prefix
    raise 'unimplemented'
  end

  def remove_pixels basename, known_domain_type
    basename
  end
end

class Image2BlockProcessor < MetadataFromBasenameBlockProcessor
  use_dsl
  named :image2

  def cirosantilli_create_block parent, attrs
    create_image_block parent, attrs
  end

  def id_prefix
    'image'
  end

  def remove_pixels basename, known_domain_type
    if known_domain_type == :wikimedia_commons
      basename.gsub(/^\d+px-/, '')
    else
      basename
    end
  end
end

class Video2BlockProcessor < MetadataFromBasenameBlockProcessor
  use_dsl
  named :video2

  def cirosantilli_create_block parent, attrs
    block = create_block parent, :video, nil, attrs
    block
  end

  def id_prefix
    'video'
  end

  def remove_pixels basename, known_domain_type
    if known_domain_type == :wikimedia_commons
      # Smaller video URLs are of form:
      #
      # https://commons.wikimedia.org/wiki/File:Oxford_Nanopore_MinION_software_channels_pannel_on_Mac.webm
      # https://upload.wikimedia.org/wikipedia/commons/7/7e/Oxford_Nanopore_MinION_software_channels_pannel_on_Mac.webm
      # https://upload.wikimedia.org/wikipedia/commons/transcoded/7/7e/Oxford_Nanopore_MinION_software_channels_pannel_on_Mac.webm/Oxford_Nanopore_MinION_software_channels_pannel_on_Mac.webm.480p.webm
      # https://upload.wikimedia.org/wikipedia/commons/transcoded/7/7e/Oxford_Nanopore_MinION_software_channels_pannel_on_Mac.webm/Oxford_Nanopore_MinION_software_channels_pannel_on_Mac.webm.480p.webm
      # https://upload.wikimedia.org/wikipedia/commons/transcoded/7/7e/Oxford_Nanopore_MinION_software_channels_pannel_on_Mac.webm/Oxford_Nanopore_MinION_software_channels_pannel_on_Mac.webm.480p.vp9.webm
      #
      # And for a transcode:
      #
      # https://upload.wikimedia.org/wikipedia/commons/transcoded/b/bb/River_water_sample_collection_with_a_bottle_and_string.ogv/River_water_sample_collection_with_a_bottle_and_string.ogv.480p.vp9.webm
      # https://commons.wikimedia.org/wiki/File:River_water_sample_collection_with_a_bottle_and_string.ogv
      basename.gsub(/([^.]+\.[^.]+).*/, '\1')
    else
      basename
    end
  end
end

# Dump IDs of document elements such as headers, images, etc. into
# a database file so we can xref2 to it across files.
#
# For debugging, debug the database with: `sqlite3 out/db.sqlite .dump`
#
# Bibliography:
#
# * https://github.com/asciidoctor/asciidoctor/issues/2500
class Xref2ExtractIdsToSqlite < Asciidoctor::Extensions::TreeProcessor
  def process document
    # jekyll-asciidoctor does a header only pass which invokes this though,
    # so we have to skip that one or else it resets the XREF2_DB to contain the top header only.
    if not document.options[:parse_header_only]
      path = root_relpath document.attributes['docfile']
      # First drop all entries from the current file. We are going to reprocess the file,
      # so we want to catch entries that have been removed.
      $XREF2_DB.execute "DELETE FROM '#{$XREF2_DB_TABLE_NAME}' WHERE path = '#{path}'"
      # Add an entry for the toplevel.
      xref2_insert_into_db path.to_s, path.to_s, document.title, %(Section "#{document.title}"),
                     'section', 0, 0
      # And now add entries for every document element.
      global_index = {
        # 0 to consider the document title section.
        section: 0
      }
      document.catalog[:refs].each do |key, ref|
        context = ref.context
        if global_index.has_key? context
          global_index[context] += 1
        else
          global_index[context] = 0
        end
        xref2_insert_into_db path.to_s, ref.id, ref.title, ref.xreftext('full'),
                       context.to_s, global_index[context], ref.level
      end
    end
    nil
  end
end

# xref that works across files.
class Xref2InlineMacroProcessor < Asciidoctor::Extensions::InlineMacroProcessor
  use_dsl
  named :xref2

  def process parent, target, attrs
    target_split = target.split($XREF2_PATH_SEPARATOR)
    current_file = root_relpath(parent.document.attributes['docfile'])
    if target_split.length > 1
      # In another file.
      target_file = target_split[0, target_split.length - 1].join($XREF2_PATH_SEPARATOR)
      target_id = target_split[-1]
      href = "#{target_file}#{$XREF2_SERVERLESS_EXT}##{target_id}"
      rows = $XREF2_DB.execute(<<~SQL
        SELECT * FROM #{$XREF2_DB_TABLE_NAME}
        WHERE path = '#{target_file}'
        AND id = '#{target_id}'
        SQL
      )
    else
      # In the current file or a toplevel header in another file?
      # First try toplevel header in another file.
      rows = $XREF2_DB.execute(<<~SQL
        SELECT * FROM #{$XREF2_DB_TABLE_NAME}
        WHERE path = '#{target}'
        SQL
      )
      if rows.length > 0
        # Yup, toplevel header of another file.
        href = "#{target}#{$XREF2_SERVERLESS_EXT}"
      else
        # Header in current file.
        rows = $XREF2_DB.execute(<<~SQL
          SELECT * FROM #{$XREF2_DB_TABLE_NAME}
          WHERE path = '#{current_file}'
          AND id = '#{target}'
          SQL
        )
        href = "##{target}"
      end
    end
    if rows.length > 0
      path, id, target_text, xrefstyle_full, context, global_index, level = rows[0]
      if attrs.key? 1
        text = attrs[1]
      else
        if attrs.key? 'xrefstyle' and attrs['xrefstyle'] == 'full'
          text = xrefstyle_full
        else
          text = target_text
        end
      end
    else
      warn = "reference not found in file #{current_file}: #{target}"
      text = warn
      if $XREF2_FAIL_ON_MISSING_REF
        raise warn
      else
        puts(warn)
      end
    end
    return create_anchor parent, text, type: :link, target: href
  end
end

# TODO not working yet.
class Xref2BlockMacroProcessor < Asciidoctor::Extensions::BlockMacroProcessor
  use_dsl
  named :xref2
  @@global_index = 0

  def process parent, target, attrs
    puts 'myxref2block'
    path = root_relpath parent.document.attributes['docfile']
    $XREF2_DB.execute \
        "INSERT INTO #{$XREF2_DB_INCLUDE_TABLE_NAME} VALUES (?, ?, ?)",
        [path, parent.id, @@global_index]
    @@global_index += 1
    nil
  end
end

Asciidoctor::Extensions.register do
  # External media processors.
  block_macro Image2BlockProcessor
  block_macro Video2BlockProcessor

  # Cross file processors.
  treeprocessor Xref2ExtractIdsToSqlite
  inline_macro Xref2InlineMacroProcessor
  block_macro Xref2BlockMacroProcessor
end
