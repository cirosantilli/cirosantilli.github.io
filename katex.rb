#!/usr/bin/env ruby

<<-HEREDOC
Asciidoctor extension to render Katex mathematics server side to HTML fast with Schmooze: https://github.com/Shopify/schmooze

Usage:

README.adoc

....
:docinfo: shared

Inline katex:[\sqrt{1+1}] katex

Block one-liner:

katex::[\sqrt{1+1}]

Block multi-liner: xref:math-test-math[]

[katex,id=math-test-math]
.A test block equation
[katex]
....
\sqrt{1+1} \\
\sqrt{1+1}
....

docinfo.html

....
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/katex@0.10.2/dist/katex.min.css"
  crossorigin="anonymous"
  integrity="sha384-yFRtMMDnQtDRO8rLpMIKrtPCD5jdktao2TV19YiZYWMDkUR5GQZR/NOVTdquEx1j"
>
<style>
.katex { font-size: 1.5em; }
</style>
....

Istall katex:

....
npm install -g katex@0.10.2
....

Use the extension:

....
asciidoctor -r katex.rb README.adoc
....
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

Asciidoctor::Extensions.register do
  block KatexBlockProcessor
  block_macro KatexBlockMacroProcessor
  inline_macro KatexInlineMacroProcessor
end
