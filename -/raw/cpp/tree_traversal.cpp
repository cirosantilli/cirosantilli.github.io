#include <cassert>
#include <deque>
#include <iostream>
#include <list>
#include <vector>

template <class T>
struct Node {
    T val;
    Node *left;
    Node *right;
public:
    Node(T val, Node *left, Node *right) : val(val), left(left), right(right) {}

    std::list<T> bfs() {
        std::list<T> ret;
        std::deque<Node<T>*> queue{this};
        while (!queue.empty()) {
            auto cur = queue.front();
            queue.pop_front();
            ret.push_back(cur->val);
            if (cur->left)
                queue.push_back(cur->left);
            if (cur->right)
                queue.push_back(cur->right);
        }
        return ret;
    }

    std::list<T> dfs_pre() {
        std::list<T> ret;
        std::vector<Node<T>*> stack{this};
        while (!stack.empty()) {
            auto cur = stack.back();
            stack.pop_back();
            ret.push_back(cur->val);
            if (cur->right)
                stack.push_back(cur->right);
            if (cur->left)
                stack.push_back(cur->left);
        }
        return ret;
    }

    std::list<T> dfs_in_rec() {
        std::list<T> ret;
        dfs_in_rec_sub(ret, this);
        return ret;
    }

    void dfs_in_rec_sub(std::list<T>& ret, Node<T>* n) {
        if (n->left)
            dfs_in_rec_sub(ret, n->left);
        ret.push_back(n->val);
        if (n->right)
            dfs_in_rec_sub(ret, n->right);
    }

    std::list<T> dfs_post_rec() {
        std::list<T> ret;
        dfs_post_rec_sub(ret, this);
        return ret;
    }

    void dfs_post_rec_sub(std::list<T>& ret, Node<T>* n) {
        if (n->left)
            dfs_post_rec_sub(ret, n->left);
        if (n->right)
            dfs_post_rec_sub(ret, n->right);
        ret.push_back(n->val);
    }
};

int main() {
    // 1
    // |
    // +------+
    // |      |
    // v      v
    // 2      3
    // |      |
    // +---+  |
    // |   |  |
    // v   v  v
    // 4   5  6
    Node<int> n4(4, nullptr, nullptr);
    Node<int> n5(5, nullptr, nullptr);
    Node<int> n6(6, nullptr, nullptr);
    Node<int> n2(2, &n4, &n5);
    Node<int> n3(3, &n6, nullptr);
    Node<int> n1(1, &n2, &n3);
    assert((n1.bfs() == std::list<int>{1, 2, 3, 4, 5, 6}));
    assert((n1.dfs_pre() == std::list<int>{1, 2, 4, 5, 3, 6}));
    assert((n1.dfs_in_rec() == std::list<int>{4, 2, 5, 1, 6, 3}));
    assert((n1.dfs_post_rec() == std::list<int>{4, 5, 2, 6, 3, 1}));
}
