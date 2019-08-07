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

* make KaTeX \newcommand work across math blocks, not supported on KaTeX 0.10.2 upstream: https://github.com/KaTeX/KaTeX/issues/2070
* Equation #num prefix to caption descriptions and xrefs. Upstream issue: https://github.com/asciidoctor/asciidoctor/issues/3378

Bibliography:

* https://github.com/asciidoctor/asciidoctor/pull/3338
HEREDOC

require 'asciidoctor'
require 'asciidoctor/extensions'
require 'schmooze'

class KatexSchmoozer < Schmooze::Base
  dependencies katex: 'katex'

  # We need this because Schmooze cannot serialize macros
  # due to circular reference at: macros['key'].token[0].loc
  # which is a complex class.
  #
  # Also keeping it in the JavaScript is the most efficient thing we can do.
  #
  # Setting a property of katex because I don't know how to create globals from
  # a function in Node: but we already have this katex global lying around.
  method :init, 'function() { katex.cirosantilli_macros = {}; }'
  method :renderToString, 'function(latex) {
  return katex.renderToString(
    latex,
    {
      macros: katex.cirosantilli_macros,
      throwOnError: true
    }
  )
}
'

end
$katex = KatexSchmoozer.new(__dir__)
$katex.init

class KatexBlockProcessor < Asciidoctor::Extensions::BlockProcessor
  use_dsl
  named :katex
  on_context :literal
  parse_content_as :raw
  def process parent, reader, attrs
    html = $katex.renderToString(reader.lines.join("\n"))
    create_paragraph parent, html, attrs, subs: nil
  end
end

class KatexBlockMacroProcessor < Asciidoctor::Extensions::BlockMacroProcessor
  use_dsl
  named :katex
  def process parent, target, attrs
    html = $katex.renderToString(attrs[1])
    create_paragraph parent, html, attrs, subs: nil
  end
end

class KatexInlineMacroProcessor < Asciidoctor::Extensions::InlineMacroProcessor
  use_dsl
  named :katex
  using_format :short
  def process parent, target, attrs
    html = $katex.renderToString(attrs[1])
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
