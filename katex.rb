#!/usr/bin/env ruby

<<-HEREDOC
Asciidoctor extension to render Katex mathematics server side to HTML fast with Schmooze: https://github.com/Shopify/schmooze

Usage:

Sample document: link:katex.adoc[]

Istall katex:

....
npm install -g katex@0.10.2
.....

Use this extension:

....
asciidoctor --require "$(pwd)/katex.rb" katex.adoc
xdg-open katex.html
....

TODO:

* make Katex macro definitions work across blocks
* Equation #num prefix to descriptions and xrefs.
HEREDOC

require 'asciidoctor'
require 'asciidoctor/extensions'
require 'schmooze'

class KatexSchmoozer < Schmooze::Base
  dependencies katex: 'katex'
  method :renderToString, 'katex.renderToString'
end
$katex = KatexSchmoozer.new(__dir__)
$macros = {}

class KatexBlockProcessor < Asciidoctor::Extensions::BlockProcessor
  use_dsl
  named :katex
  on_context :literal
  parse_content_as :raw
  def process parent, reader, attrs
    content = $katex.renderToString(
      reader.lines.join("\n"),
      {
        macros: $macros,
        throwOnError: true
      }
    )
    create_paragraph parent, content, attrs, subs: nil
  end
end

class KatexBlockMacroProcessor < Asciidoctor::Extensions::BlockMacroProcessor
  use_dsl
  named :katex
  def process parent, target, attrs
    content = $katex.renderToString(
      attrs[1],
      {
        macros: $macros,
        throwOnError: true
      }
    )
    create_paragraph parent, content, attrs, subs: nil
  end
end

class KatexInlineMacroProcessor < Asciidoctor::Extensions::InlineMacroProcessor
  use_dsl
  named :katex
  using_format :short
  def process parent, target, attrs
    html = $katex.renderToString(
      attrs[1],
      {
        macros: $macros,
        throwOnError: true
      }
    )
    create_inline parent, :quoted, html
  end
end

class KatexDocinfoProcessor < Asciidoctor::Extensions::DocinfoProcessor
  use_dsl
  def process doc
    %{<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/katex@#{doc.attributes.fetch('katex-version', '0.10.2')}/dist/katex.min.css"
  crossorigin="anonymous"
>
<style>
.katex { font-size: #{doc.attributes.fetch('katex-font-size', '1.5em')}; }
</style>
}
  end
end

Asciidoctor::Extensions.register do
  block KatexBlockProcessor
  block_macro KatexBlockMacroProcessor
  docinfo_processor KatexDocinfoProcessor
  inline_macro KatexInlineMacroProcessor
end
