#include <cassert>
#include <list>
#include <unordered_set>
#include <unordered_map>
#include <utility>
#include <vector>

template <class T>
struct Node {
    Node(T n) : dependencies_left(0), n(n) {};
    int dependencies_left;
    T n;
    std::vector<Node*> dependants;
};

template <class T>
std::list<T> topological_sort(const std::vector<std::pair<T,T>>& pairs) {
    std::list<T> ret;
    std::unordered_map<T,Node<T>> n_to_node;
    std::vector<const Node<T>*> nodeps;

    // Initialize graph.
    for (const auto& pair : pairs) {
        // Perfect example of an application of emplace! Because:
        // * we want the storage to live in n_to_node
        // * we don't want to define or call an unecessary default constructor
        auto val1 = pair.first;
        auto& n1 = (n_to_node.emplace(val1, val1).first)->second;
        auto val2 = pair.second;
        auto& n2 = (n_to_node.emplace(val2, val2).first)->second;
        n1.dependants.push_back(&n2);
        n2.dependencies_left++;
    }

    // Initialize and run.
    for (auto& kv : n_to_node) {
        auto& node = kv.second;
        if (node.dependencies_left == 0) {
            nodeps.push_back(&node);
        }
    }
    while (!nodeps.empty()) {
        const auto& cur = nodeps.back();
        nodeps.pop_back();
        ret.push_back(cur->n);
        for (const auto& dependant : cur->dependants) {
            dependant->dependencies_left--;
            if (dependant->dependencies_left == 0)
                nodeps.push_back(dependant);
        }
    }
    return ret;
}

int main() {
    /*
       6        4
       |        |
    +--+--+     v
    |  |  |     7
    v  |  v
    3  |  2-+
    |  |  | |
    |  v  | |
    +->1<-+ |
       |    |
       v    |
       5<<--+
    */
    std::vector<std::pair<int,int>> in{
        {6, 3},
        {6, 2},
        {3, 1},
        {2, 1},
        {6, 1},
        {1, 5},
        {2, 5},
        {4, 7},
    };
    assert((
        topological_sort(in) ==
        std::list{6, 2, 3, 1, 5, 4, 7}
        // Also OK.
        //std::list{6, 4, 3, 2, 7, 1, 5}
    ));
}
