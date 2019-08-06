#!/usr/bin/env ruby

<<-HEREDOC
Asciidoctor extension to render Katex mathematics server side to HTML fast with Schmooze: https://github.com/Shopify/schmooze

Vs other alternatives that I've seen:

* MathJax (built-in to asciidoctor 2.0.10):
** reflows the page several times, seconds after initial load, which is terrible if you link into a `#some-header` location of the page
** not sure can be done server-side, which increases render speed even further and dispenses JavaScript on the browser
** TODO I couldn't find yet how to define macros with arguments from the JS API either as workaround
* AsciiMath: not LaTeX syntax, so larger learning curve and less functionality
* https://github.com/jirutka/asciidoctor-katex extension at commit 30b037dfe369cec280f07aa2ee5ae365cf1a253c:
** compilation is slow https://github.com/asciidoctor/asciidoctor/pull/3338#issuecomment-502045350
** you need to manually include docinfo
* https://github.com/asciidoctor/asciidoctor-mathematical which uses https://github.com/gjtorikian/mathematical which converts equations into "SVGs, PNGs, or MathML", so either clunky images that have to be uploaded, or MathML which has low support. KaTeX uses just plain HTML and CSS!

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

* make KaTeX \global\def \newcommand work across math blocks
** both blocked on the fact that `macros` is a circular structure, so Schmooze won't return it.
+
See failed workaround attempt on the code.
** \newcommand across blocks not supported on KaTeX 0.10.2 upstream at all: https://github.com/KaTeX/KaTeX/issues/2070
* Equation #num prefix to caption descriptions and xrefs

Bibliography:

* https://github.com/asciidoctor/asciidoctor/pull/3338
HEREDOC

require 'asciidoctor'
require 'asciidoctor/extensions'
require 'schmooze'

class KatexSchmoozer < Schmooze::Base
  dependencies katex: 'katex'

  method :renderToString, 'function(latex, macros) {
  return katex.renderToString(
    latex,
    {
      throwOnError: true
    }
  )
}
'

#  # Failed attempt at persisting macros across calls.
#  #
#  # Schmooze does not modify input arguments back on Ruby,
#  # that's why we try to return it.
#  method :renderToString, 'function(latex, macros) {
#  html = katex.renderToString(
#    latex,
#    {
#      macros: macros,
#      throwOnError: true
#    }
#  )
#  // Try to make the macros object non-circular. TODO: this
#  // works on raw Node.js, but here it makes the program hang forever.
#  for (let key in macros) {
#    macro = macros[key]
#    for (let token of macro.tokens) {
#      // This is the line that makes the program hang.
#      delete token.loc
#    }
#  }
#  return [html, macros]
#}
#'

end
$katex = KatexSchmoozer.new(__dir__)
$macros = {
  '\\magicMacro', ''
}

class KatexBlockProcessor < Asciidoctor::Extensions::BlockProcessor
  use_dsl
  named :katex
  on_context :literal
  parse_content_as :raw
  def process parent, reader, attrs
    html, $macros = $katex.renderToString(reader.lines.join("\n"), $macros)
    create_paragraph parent, html, attrs, subs: nil
  end
end

class KatexBlockMacroProcessor < Asciidoctor::Extensions::BlockMacroProcessor
  use_dsl
  named :katex
  def process parent, target, attrs
    html, $macros = $katex.renderToString(attrs[1], $macros)
    create_paragraph parent, html, attrs, subs: nil
  end
end

class KatexInlineMacroProcessor < Asciidoctor::Extensions::InlineMacroProcessor
  use_dsl
  named :katex
  using_format :short
  def process parent, target, attrs
    html, $macros = $katex.renderToString(attrs[1], $macros)
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
