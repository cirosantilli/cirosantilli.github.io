// Count the size of the connected compon
// https://stackoverflow.com/questions/16476099/remove-duplicate-entries-in-a-c-vector

#include <cassert>
#include <cstdlib>
#include <unordered_set>
#include <vector>

struct Node {
    std::vector<Node*> to;
    size_t connected_component_size() {
        std::vector<Node*> todo{this};
        std::unordered_set<Node*> visited{this};
        while (!todo.empty()) {
            auto cur = todo.back();
            todo.pop_back();
            for (const auto& to : cur->to) {
                if (visited.insert(to).second)
                    todo.push_back(to);
            }
        }
        return visited.size();
    }
} ;

int main() {
    Node n1, n2, n3, n4, n5;
    n1.to.push_back(&n2);
    n1.to.push_back(&n3);
    n2.to.push_back(&n3);
    // Add a loop to test that.
    n3.to.push_back(&n4);
    n4.to.push_back(&n5);
    n5.to.push_back(&n1);
    assert(n1.connected_component_size() == 5);
}
