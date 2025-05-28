#include <cassert>
#include <set>
#include <string>
#include <unordered_map>
#include <vector>
#include <iostream>

class Trie {
public:
    void push(char c, Trie* child, bool terminal) {
        children[c] = { child, terminal };
        ordered_keys.insert(c);
    }

    std::vector<std::string> findPrefix(std::string pref) {
        std::vector<std::string> ret;
        auto cur = this;
        bool terminal;
        for (const char c : pref) {
            auto child = children.find(c);
            if (child == children.end())
                break;
            cur = child->second.first;
            terminal = child->second.second;
        }
        std::vector<std::tuple<Trie*,bool,std::string>> todo = {{cur, terminal, pref}};
        while (!todo.empty()) {
            auto [cur, terminal, curPref] = todo.back();
            todo.pop_back();
            if (terminal) {
                ret.push_back(curPref);
            }
            for (auto it = cur->ordered_keys.rbegin(); it != cur->ordered_keys.rend(); ++it) {
                auto c = *it;
                auto child = cur->children[c];
                todo.emplace_back(child.first, child.second, curPref + c);
            }
        }
        return ret;
    }
private:
    std::unordered_map<char,std::pair<Trie*,bool>> children;
    std::set<char> ordered_keys;
};
// TODO convert to typedef. Needs something else to forward declare Trie*,
// not sure if possible and how.
//typedef std::unordered_map<char,std::pair<Trie*,bool>> Trie;

int main() {
    // The wikipedia example nodes numbered breadth first.
    Trie tries[11];
    // t
    tries[0].push('t', &tries[1], false);
    // A
    tries[0].push('A', &tries[2], true);
    // i
    tries[0].push('i', &tries[3], false);
    // to
    tries[1].push('o', &tries[4], true);
    // te
    tries[1].push('e', &tries[5], false);
    // in
    tries[3].push('n', &tries[6], true);
    // tea
    tries[5].push('a', &tries[7], true);
    // ted
    tries[5].push('d', &tries[8], true);
    // ten
    tries[5].push('n', &tries[9], true);
    // inn
    tries[6].push('n', &tries[10], true);

    // 
    assert(
        tries[0].findPrefix("t") ==
        (std::vector<std::string>{
            "tea",
            "ted",
            "ten",
            "to",
        })
    );
}
