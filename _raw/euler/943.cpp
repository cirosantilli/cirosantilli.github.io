// https://github.com/lucky-bai/projecteuler-solutions/issues/100#issuecomment-3552252592

#include <bits/stdc++.h>

using namespace std;

namespace {
using u64 = unsigned long long;
using u128 = __uint128_t;

struct Result {
    u64 count_a = 0;
    u64 count_b = 0;
    u64 next_state = 0;

    u64 total() const { return count_a + count_b; }
};

struct KolakoskiSolver {
    int a;
    int b;
    unordered_map<u64, Result> cache;

    explicit KolakoskiSolver(int aa, int bb) : a(aa), b(bb) {
        cache.reserve(1 << 15);
    }

    Result calc(u64 state, int level, u64 maxlen) {
        u64 length_bit = 2ULL << level;
        u64 bit = state & length_bit;
        u64 run_len = bit ? static_cast<u64>(b) : static_cast<u64>(a);
        u64 count = min(run_len, maxlen);

        if (level == 0) {
            Result res;
            if ((state & 1ULL) == 0ULL) {
                res.count_a = count;
            } else {
                res.count_b = count;
            }
            res.next_state = state ^ 1ULL;
            return res;
        }

        u64 produced_a = 0;
        u64 produced_b = 0;
        u64 substate = state ^ bit;
        for (u64 i = 0; i < count; ++i) {
            u64 child_key = substate + (2ULL << level);
            Result child;
            auto it = cache.find(child_key);
            if (it != cache.end()) {
                u64 child_total = it->second.count_a + it->second.count_b;
                if (produced_a + produced_b + child_total <= maxlen) {
                    child = it->second;
                } else {
                    child = calc(substate, level - 1, maxlen - (produced_a + produced_b));
                }
            } else {
                child = calc(substate, level - 1, maxlen - (produced_a + produced_b));
            }
            produced_a += child.count_a;
            produced_b += child.count_b;
            substate = child.next_state;
        }

        Result res;
        res.count_a = produced_a;
        res.count_b = produced_b;
        res.next_state = substate ^ bit ^ (1ULL << level);
        cache[state + (4ULL << level)] = res;
        return res;
    }
};

struct CountsAB {
    u64 count_a;
    u64 count_b;
    int level_used;
};

CountsAB evaluate_counts(int a, int b, u64 limit) {
    KolakoskiSolver solver(a, b);
    int level = 0;
    Result res{};
    do {
        res = solver.calc(0ULL, level, limit);
        ++level;
    } while (res.count_a + res.count_b < limit && level < 64);
    if (res.count_a + res.count_b < limit) {
        throw runtime_error("Insufficient level depth");
    }
    return CountsAB{res.count_a, res.count_b, level - 1};
}

u64 compute_T(int a, int b, u64 limit) {
    CountsAB counts = evaluate_counts(a, b, limit);
    u128 sum = static_cast<u128>(counts.count_a) * static_cast<u128>(a) +
               static_cast<u128>(counts.count_b) * static_cast<u128>(b);
    return static_cast<u64>(sum);
}

} // namespace

int main(int argc, char **argv) {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    constexpr u64 MOD = 2233222333ULL;
    constexpr u64 N = 22332223332233ULL;

    if (argc == 4) {
        int a = stoi(argv[1]);
        int b = stoi(argv[2]);
        u64 limit = stoull(argv[3]);
        if (a < 2 || b < 2 || a > 223 || b > 223 || a == b) {
            cerr << "Invalid parameters" << '\n';
            return 1;
        }
        CountsAB counts = evaluate_counts(a, b, limit);
        u64 value = static_cast<u64>(counts.count_a * static_cast<u64>(a) +
                                     counts.count_b * static_cast<u64>(b));
        cout << value << '\n';
        return 0;
    }

    u64 total = 0ULL;
    for (int a = 2; a <= 223; ++a) {
        for (int b = 2; b <= 223; ++b) {
            if (a == b) continue;
            u64 contribution = compute_T(a, b, N) % MOD;
            total += contribution;
            total %= MOD;
        }
    }

    cout << total % MOD << '\n';
    return 0;
}
