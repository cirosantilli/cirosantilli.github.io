#!/usr/bin/env python

def metrics(
    # Number of layers
    L,
    # Embedding dimension
    d_model,
    # Dimension of hidden layer of fully connected layer
    d_ff,
    # Number of head
    h, 
    # Dimension of K and Q
    d_head,
    # Context length
    n_ctx,
    vocab_size,
    # Grouped query attention. TODO implement.
    kv_heads=None,
):
    return {
        'mults_per_token': 
            # My limited brain
            L * (
                h * (
                    # 1x K, 1x Q, and 2x for V rank decomposed
                    4 * d_model * d_head +
                    # Right-most column of KQ product
                    n_ctx * d_head +
                    # All values times newly calculated right-most column
                    n_ctx * d_model
                ) +
                # MLP for latest token only
                2 * d_model * d_ff
            ) +
            # Output projection
            d_model * vocab_size

            ## ChatGPT
            #(
            #    L * (
            #        4 * d_model**2 +
            #        h * d_head * n_ctx +
            #        # MLP for latest token only
            #        2 * d_model * d_ff
            #    ) +
            #    # Output projection
            #    d_model * vocab_size
            #)
        ,

        # I think that with KV caching we are basically just doing matrix-vector multiplication.
        # So the number of params equals the number of FLOPs for the most part, and it is memory
        # bottle-necked, unless we do some query batching.
        'n_params': (
            L * (
                h * (
                    # 1x K, 1x Q, and 2x for V rank decomposed
                    4 * d_model * d_head
                ) +
                # Fully connected layer, rank decomposed
                2 * d_ff * d_model
            ) +
            # Output projection
            d_model * vocab_size
        )
    }

# https://stackoverflow.com/questions/579310/formatting-long-numbers-as-strings
def human_format(num):
    num = float('{:.3g}'.format(num))
    magnitude = 0
    while abs(num) >= 1000:
        magnitude += 1
        num /= 1000.0
    return '{} {}'.format('{:f}'.format(num).rstrip('0').rstrip('.'), ['', 'K', 'M', 'G', 'T'][magnitude])

models = {
    'gpt-2': {
        "L": 12,
        "d_model": 768,
        "d_ff": 3072,
        "h": 12,
        "d_head": 64,
        "n_ctx": 1024,
        "vocab_size": 50257,
    },
    'gpt-3': {
        "L": 96,
        "d_model": 12288,
        "d_ff": 49152,
        "h": 96,
        "d_head": 128,
        "n_ctx": 2048,
        "vocab_size": 50257,
    },
    # https://arxiv.org/pdf/2407.21783
    'llama-3-1-70b': {
        "L": 80,
        "d_model": 8192,
        "d_ff": 28672,
        "h": 64,
        # TODO source
        "d_head": 128,
        "kv_heads": 8,
        "n_ctx": 8192,
        "vocab_size": 128000,
    },
    #'deepseek-v2-67b': {
    #    "L": 80,
    #    "d_model": 8192,
    #    "d_ff": 28672,
    #    "h": 64,
    #    "n_ctx": 8192,
    #    "vocab_size": 130000,
    #},
}
for name, params in models.items():
    res = metrics(**params)
    print(name)
    print(f'mults_per_token: {res['mults_per_token']:,} (~{human_format(res['mults_per_token'])})')
    print(f'n_params: {res['n_params']:,} (~{human_format(res['n_params'])})')
    print()
