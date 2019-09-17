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
    basename_noext = remove_pixels(File.basename(target, File.extname(target)))
    if attrs.has_key? 'title'
      title = attrs['title']
    else
      title = basename_noext.gsub(/_+/, ' ')
    end
    title_nosource = title
    if attrs.has_key? 'source'
      title += ". link:++#{attrs['source']}++[Source]."
    end
    if attrs.has_key? 'id'
      id = attrs['id']
    else
      id = id_prefix + '-' + title_nosource.gsub(/ +/, '-').downcase
    end
    if !attrs.has_key? 'link'
      attrs['link'] = '#' + id
    end
    attrs['id'] = id
    attrs['title'] = title
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
