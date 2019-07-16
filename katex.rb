#!/usr/bin/env ruby

require 'asciidoctor'
require 'asciidoctor/extensions'
require 'schmooze'

class KatexSchmoozer < Schmooze::Base
  dependencies katex: 'katex'
  method :renderToString, 'katex.renderToString'
end
$katex = KatexSchmoozer.new(__dir__)

class KatexInline < Asciidoctor::Extensions::InlineMacroProcessor
  use_dsl
  named :latexmath

  def process parent, target, attrs
    # TODO never gets called.
    asdf
    text = attrs[1]
    if text.nil? || text.empty?
      text = target
    end
    if !ExternalLinkRegex.match?(target)
      target = File.join(target_base, target)
    end
    $katex.renderToString("\\sqrt{1+1} = 2", {throwOnError: false})
    create_anchor parent, text, type: :link, target: target
  end
end

class KatexBlock < Asciidoctor::Extensions::TreeProcessor
  def process document
    return unless document.blocks?
    process_blocks document
    nil
  end

  def process_blocks node
    node.blocks.each_with_index do |block, i|
      if block.context == :stem and block.style == "latexmath"
        # TODO getting called, and I have the content, now I need to replace it.
        #puts block
        #puts block.content
        #puts $katex.renderToString(block.content, {throwOnError: false})
      end
      process_blocks block if block.blocks?
    end
  end
end

Asciidoctor::Extensions.register do
  inline_macro KatexInline
  treeprocessor KatexBlock
end
