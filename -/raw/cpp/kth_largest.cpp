#include <queue>
#include <utility>
#include <vector>

typedef std::vector<int>::size_type Size;

// As mentioned at:
// https://leetcode.com/problems/kth-largest-element-in-an-array/solutions/60309/c-stl-partition-and-heapsort/
// std::partial_sort and std::nth_largest could from C++17 be used to get the answer even more directly
int priority_queue(const std::vector<int>& v, Size k) {
    std::priority_queue<int, std::vector<int>, std::greater<int>> q;
    for (Size i = 0; i < k; i++) {
        const auto& n = v[i];
        q.push(n);
    }
    for (Size i = k; i < v.size(); i++) {
        const auto& n = v[i];
        if (q.top() < n) {
            q.pop();
            q.push(n);
        }
    }
    return q.top();
}

int main() {
}
