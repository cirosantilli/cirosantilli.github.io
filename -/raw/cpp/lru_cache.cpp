// https://stackoverflow.com/questions/2504178/lru-cache-design

#include <cassert>
#include <list>
#include <unordered_map>

#include <iostream>
#include <format>

template<class KEY, class VAL>
class LruCache {
private:
    size_t maxSize;
    std::list<KEY> keyList;
    std::unordered_map<KEY,std::pair<decltype(keyList.begin()),VAL>> keyToVal;
public:
    LruCache(size_t maxSize) : maxSize(maxSize) {
    }

    bool get(KEY key, VAL& val) {
        auto it = keyToVal.find(key);
        if (it == keyToVal.end())
            return false;
        auto itVal = it->second;
        val = itVal.second;
        keyList.splice(keyList.begin(), keyList, itVal.first);
        return true;
    }

    void put(KEY key, VAL val) {
        if (keyList.size() == maxSize) {
            const auto& lastKey = *keyList.rbegin();
            keyList.pop_back();
            keyToVal.erase(lastKey);
        }
        keyList.push_front(key);
        keyToVal[key] =  { keyList.begin(), val };
    }
};

int main() {
    auto c = LruCache<int,int>(2);
    int ret;

    // Missing key.
    assert(!c.get(0, ret));

    // Hits

    c.put(1, 1);
    c.put(2, 4);

    assert(c.get(1, ret));
    assert(ret == 1);

    assert(c.get(2, ret));
    assert(ret == 4);

    // Replace 1 with 3.

    c.put(3, 9);

    assert(!c.get(1, ret));

    assert(c.get(2, ret));
    assert(ret == 4);

    assert(c.get(3, ret));
    assert(ret == 9);
}
