// Check if two std::string objects are a permutation of one another.

#include <cassert>
#include <unordered_map>
#include <string>

bool is_permutation(const std::string& s1, const std::string& s2) {
    std::unordered_map<char,int> counts1, counts2;
    for (const auto& c : s1) {
        counts1[c]++;
    }
    for (const auto& c : s2) {
        counts2[c]++;
    }
    return counts1 == counts2;
}

int main() {
    assert(is_permutation("", ""));
    assert(is_permutation("a", "a"));
    assert(is_permutation("ab", "ab"));
    assert(is_permutation("ab", "ba"));
    assert(!is_permutation("a", "b"));
    assert(!is_permutation("a", "aa"));
}
