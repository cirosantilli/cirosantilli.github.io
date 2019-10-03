require 'asciidoctor/extensions'

require 'sqlite3'

# Cross reference database.
$PROJECT_ROOT = File.dirname(File.dirname(__FILE__))
$DB_DIR = File.join($PROJECT_ROOT, 'out')
$DB_PATH = File.join($DB_DIR, 'db.sqlite')
FileUtils.mkdir_p $DB_DIR
$DB = SQLite3::Database.new $DB_PATH
$DB_TABLE_NAME = 'sections'
# The extension this character for for all OSes.
$PATH_SEPARATOR = '/'
# Check if table exists and create it if it doesn't.
if $DB.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='#{$DB_TABLE_NAME}';").empty?
  $DB.execute <<-SQL
    CREATE TABLE '#{$DB_TABLE_NAME}' (
      path TEXT,
      level INT,
      id TEXT,
      title TEXT
    );
  SQL
end
$DB_FAIL_ON_MISSING_REF = ENV['CIROSANTILLI_COM_DB_FAIL_ON_MISSING_REF'] == '1'

def db_root_relpath path
  f = Pathname.new(path).relative_path_from($PROJECT_ROOT)
  File.basename(f,File.extname(f))
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
class MetadataFromBasenameBlockProcessor < Asciidoctor::Extensions::BlockMacroProcessor
  use_dsl

  def process parent, target, attrs
    attrs['target'] = target
    basename_no_pixels = remove_pixels(File.basename(target))
    basename_noext = File.basename(basename_no_pixels, File.extname(target))

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
      automatic_source = automatic_source basename_no_pixels
      if automatic_source
        source = automatic_source
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
    cirosantilli_create_block parent, attrs
  end

  def automatic_source basename_no_pixels
    nil
  end

  def cirosantilli_create_block parent, attrs
    raise 'unimplemented'
  end

  def id_prefix
    raise 'unimplemented'
  end

  def remove_pixels basename_noext
    basename_noext
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
end

# An Image2 that also parses wikimedia URLS to add the following automation.
#
# Pixel size prefixes are removed from basenames, e.g.:
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
# This is especially important because we want to use the smallest image
# possible to reduce page load times.
class WikimediaImage2BlockProcessor < Image2BlockProcessor
  use_dsl
  named :wikimedia_image

  def automatic_source basename_no_pixels
    wikimedia_automatic_source basename_no_pixels
  end

  def remove_pixels basename_noext
    basename_noext.gsub(/^\d+px-/, '')
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
end

# Like WikimediaImage2BlockProcessor but for videos.
#
# Smaller video URLs are of form:
#
# https://commons.wikimedia.org/wiki/File:Oxford_Nanopore_MinION_software_channels_pannel_on_Mac.webm
# https://upload.wikimedia.org/wikipedia/commons/7/7e/Oxford_Nanopore_MinION_software_channels_pannel_on_Mac.webm
# https://upload.wikimedia.org/wikipedia/commons/transcoded/7/7e/Oxford_Nanopore_MinION_software_channels_pannel_on_Mac.webm/Oxford_Nanopore_MinION_software_channels_pannel_on_Mac.webm.480p.webm
# https://upload.wikimedia.org/wikipedia/commons/transcoded/7/7e/Oxford_Nanopore_MinION_software_channels_pannel_on_Mac.webm/Oxford_Nanopore_MinION_software_channels_pannel_on_Mac.webm.480p.webm
# https://upload.wikimedia.org/wikipedia/commons/transcoded/7/7e/Oxford_Nanopore_MinION_software_channels_pannel_on_Mac.webm/Oxford_Nanopore_MinION_software_channels_pannel_on_Mac.webm.480p.vp9.webm
class WikimediaVideo2BlockProcessor < Video2BlockProcessor
  use_dsl
  named :wikimedia_video

  def automatic_source basename_no_pixels
    wikimedia_automatic_source basename_no_pixels
  end

  def remove_pixels basename_noext
    basename_noext.gsub(/\.[^.]+\.\d+p(\.[^.]+)?(\.[^.]+)$/, '\2')
  end
end

# Dump IDs into a database so we can xref2 to it across files.
#
# For debugging, debug the database with: `sqlite3 out/db.sqlite .dump`
class ExtractHeaderIds < Asciidoctor::Extensions::TreeProcessor
  def process document
    if not document.options[:parse_header_only]
      # Drop all entries from the current file. We are going to reprocess the file,
      # so we want to catch entries that have been removed.
      #
      # jekyll-asciidoctor does a header only pass which invokes this though,
      # so we have to skip that one or else it resets the DB to contain the top header only.
      path = db_root_relpath document.attributes['docfile']
      $DB.execute "DELETE FROM '#{$DB_TABLE_NAME}' WHERE path = '#{path}'"
      (document.find_by context: :section).each do |section|
        # The toplevel header does not have an ID.
        if section.level == 0
          id = Asciidoctor::Section.generate_id(document.attributes['docname'], document)
        else
          id = section.id
        end
        $DB.execute "INSERT INTO #{$DB_TABLE_NAME} VALUES (?, ?, ?, ?)",
          [path.to_s, section.level, id, section.title]
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
    target_split = target.split($PATH_SEPARATOR)
    if target_split.length > 1
      # In another file.
      target_file = target_split[0, target_split.length - 1].join($PATH_SEPARATOR)
      target_id = target_split[-1]
      href = "#{target_file}##{target_id}"
      rows = $DB.execute(
        "SELECT * FROM #{$DB_TABLE_NAME} " \
        "WHERE path = '#{target_file}' " \
        "AND id = '#{target_id}';"
      )
    else
      # In the current file or a toplevel header in another file?
      # First try toplevel header in another file.
      rows = $DB.execute(
        "SELECT * FROM #{$DB_TABLE_NAME} " \
        "WHERE path = '#{target}' " \
        "AND level = 0;"
      )
      href = target
      if rows.length == 0
        # If not found, then try a header in the current file.
        current_file = db_root_relpath parent.document.attributes['docfile']
        rows = $DB.execute(
          "SELECT * FROM #{$DB_TABLE_NAME} " \
          "WHERE path = '#{current_file}' " \
          "AND id = '#{target}';"
        )
        href = "##{target}"
      end
    end
    if rows.length > 0
      path, level, id, target_text = rows[0]
      if attrs.key?(1)
        text = attrs[1]
      else
        text = target_text
      end
    else
      warn = "reference not found: #{target}"
      text = warn
      if $DB_FAIL_ON_MISSING_REF
        raise warn
      else
        puts(warn)
      end
    end
    return create_anchor parent, text, type: :link, target: href
  end
end

Asciidoctor::Extensions.register do
  block_macro Image2BlockProcessor
  block_macro Video2BlockProcessor
  block_macro WikimediaImage2BlockProcessor
  block_macro WikimediaVideo2BlockProcessor
  treeprocessor ExtractHeaderIds
  inline_macro Xref2InlineMacroProcessor
end
