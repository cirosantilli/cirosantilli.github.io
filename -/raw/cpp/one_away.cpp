#include <cassert>
#include <cstdlib>
#include <string>

bool oneAway(const std::string& s1, const std::string& s2) {
    bool used = false;
    const auto s1Size = s1.size();
    const auto s2Size = s2.size();
    size_t i1 = 0;
    size_t i2 = 0;
    if (s1Size == s2Size) {
        // Replacement
        while (i1 < s1Size) {
            if (s1[i1] != s2[i2]) {
                if (used) {
                    return false;
                } else {
                    used = true;
                }
            }
            i1++;
            i2++;
        }
    } else if (s1Size < s2Size) {
        // Insertion
        if (s1Size < s2Size - 1)
            return false;
        while (i1 < s1Size) {
            if (s1[i1] == s2[i2]) {
                i1++;
            } else {
                if (used) {
                    return false;
                } else {
                    used = true;
                }
            }
            i2++;
        }
    } else {
        // Deletion
        if (s2Size < s1Size - 1)
            return false;
        while (i1 < s1Size) {
            if (s1[i1] == s2[i2]) {
                i2++;
            } else {
                if (used) {
                    return false;
                } else {
                    used = true;
                }
            }
            i1++;
        }
    }
    return true;
}

int main() {
    assert(oneAway("", ""));
    assert(oneAway("", "a"));
    assert(oneAway("pale", "ple"));
    assert(oneAway("pales", "pale"));
    assert(oneAway("pale", "bale"));
    assert(!oneAway("pale", "bae"));
}
