#include <cassert>
#include <iostream>
#include <unordered_map>
#include <vector>

typedef std::vector<int>::size_type Size;

bool subset_sum_naive_rec(
    const std::vector<int>& in,
    int target,
    Size i,
    int cur_sum,
    std::vector<Size>& out
) {
    if (cur_sum == target)
        return true;
    if (i == in.size())
        return false;
    if (subset_sum_naive_rec(in, target, i + 1, cur_sum + in[i], out)) {
        out.push_back(i);
        return true;
    }
    if (subset_sum_naive_rec(in, target, i + 1, cur_sum, out)) {
        return true;
    }
    return false;
}

bool subset_sum_naive(
    const std::vector<int>& in,
    int target,
    std::vector<Size>& out
) {
    return subset_sum_naive_rec(in, target, 0, 0, out);
}

bool subset_sum_dp(
    const std::vector<int>& in,
    const int target,
    std::vector<Size>& out
) {
    const auto& n = in.size();
    if (n == 0)
        return target == 0;
    // sum -> at which index it was achieved + 1.
    std::unordered_map<int,Size> dp{{0,0}};

    // Determine some pruning bounds that we can't go above/below.
    int min = 0;
    int max = 0;
    for (const auto& n : in) {
        if (n > 0) {
            max += n;
        } else {
            min += n;
        }
    }
    const int min_consider = target - max;
    const int max_consider = target - min;

    // Do the calculation.
    for (Size i = 0; i < n; i++) {
        const auto val = in[i];
        std::vector<int> new_sums;
        for (const auto& [sum, idx] : dp) {
            const auto new_sum = sum + val;
            if (
                min_consider <= new_sum &&
                new_sum <= max_consider &&
                !dp.contains(new_sum)
            )
                new_sums.push_back(new_sum);
        }
        for (const auto& new_sum : new_sums) {
            dp.emplace(new_sum, i + 1);
            if (new_sum == target)
                goto found;
        }
    }
    return false;

    // Roll back to build the indices.
found:
    int sum = target;
    for (const auto&[k,v] : dp) {
        std::cout << k << " " << v << std::endl;
    }
    std::cout << std::endl;
    do {
        std::cout << sum << std::endl;
        auto i = dp.at(sum) - 1;
        out.push_back(i);
        sum -= in[i];
    } while (sum != 0);
    return true;
}

int main() {
    std::vector<Size> out;
    for (const auto& f : std::vector{subset_sum_naive, subset_sum_dp}) {
        assert(!f({1, 2, 3, 4, 5}, 90, out));
        out.clear();

        assert(f({1, 3, 5, 8}, 12, out));
        assert(out == (std::vector<Size>{3, 1, 0}));
        out.clear();

        assert(f({-1, 3, 5, 8}, 12, out));
        assert(out == (std::vector<Size>{3, 2, 0}));
        out.clear();
    }

    // Big ones where naive would take forever.
    for (const auto& f : std::vector{subset_sum_dp}) {
        // From LeetCode. This test is well designed and caught a bug that we had
        // when inserting into the map while looping over it which could make
        // a single element get considered twice.
        std::vector<int> in(198, 100);
        in.push_back(99);
        in.push_back(97);
        assert(!f(in, 9998, out));
        out.clear();
    }
}
