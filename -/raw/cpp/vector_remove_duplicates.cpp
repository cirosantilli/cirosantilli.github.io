// Check if two std::string objects are a permutation of one another.
// https://stackoverflow.com/questions/16476099/remove-duplicate-entries-in-a-c-vector

#include <cassert>
#include <unordered_set>
#include <vector>

template <class T>
std::vector<T> remove_duplicates(const std::vector<T>& v) {
    std::unordered_set<T> set;
    std::vector<T> ret;
    for (const auto& n : v) {
        if (set.insert(n).second)
            ret.push_back(n);
    }
    return ret;
}

int main() {
    assert(
        remove_duplicates(std::vector{3, 2, 2, 1, 3}) ==
        (std::vector{3, 2, 1})
    );
}
