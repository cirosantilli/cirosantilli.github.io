require 'asciidoctor/extensions'

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
# * ID: 'Asdf_qwer_zx-cv -> 'image-asdf-qwer-zx-cv'
# * title: 'Asdf qwer_zx-cv -> 'asdf-qwer-zx-cv'
class MetadataFromBasenameBlockProcessor < Asciidoctor::Extensions::BlockMacroProcessor
  use_dsl

  def process parent, target, attrs
    #html = $katex.renderToString(reader.lines.join("\n"))
    #create_paragraph parent, 'asdf', attrs, subs: nil
    #require 'pry'; binding.pry
    attrs['target'] = target
    basename_noext = remove_pixels(File.basename(target, File.extname(target)))
    id = id_prefix + '-' + basename_noext.gsub(/_+/, '-').downcase
    if !attrs.has_key? 'id'
      attrs['id'] = id
    end
    if !attrs.has_key? 'link'
      attrs['link'] = '#' + id
    end
    if !attrs.has_key? 'title'
      attrs['title'] = basename_noext.gsub(/_+/, ' ')
    end
    cirosantilli_create_block parent, attrs
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

# An Image2 that also removes pixel size prefixes from basenames, e.g.:
#
# ....
# https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Rive_water_sample_collection_swans.jpg/640px-Rive_water_sample_collection_swans.jpg
# ....
#
# becomes:
#
# ....
# some-file-name
# ....
#
# This is especially important because we want to use the smallest image
# possible to reduce page load times.
class WikimediaImage2BlockProcessor < Image2BlockProcessor
  use_dsl
  named :wikimedia_image
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

Asciidoctor::Extensions.register do
  block_macro Image2BlockProcessor
  block_macro Video2BlockProcessor
  block_macro WikimediaImage2BlockProcessor
end
