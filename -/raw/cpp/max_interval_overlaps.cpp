#include <cassert>
#include <list>
#include <map>
#include <iostream>
#include <utility>

// At which point do most intervals overlap.
int max_interval_overlaps(const std::list<std::pair<int,int>>& people, int &max) {
    std::map<int,int> births;
    std::map<int,int> deaths;
    max = 0;
    int curCount = 0;
    for (const auto& person : people) {
        births[person.first]++;
        deaths[person.second]++;
    }
    auto bit = births.begin();
    int maxYear = bit->first;
    auto dit = deaths.begin();
    while (bit != births.end()) {
        auto year = bit->first;
        auto newBirths = bit->second;
        curCount += newBirths;
        if (curCount > max) {
            maxYear = year;
            max = curCount;
        }
        bit++;
        while (dit->first < bit->first) {
            curCount--;
            dit++;
        }
    }
    return maxYear;
}

int main() {
    int max;
    assert(max_interval_overlaps({
        {1, 5},
        {3, 10},
        {3, 4},
        {4, 5},
        {4, 5},
        {7, 12},
        {11, 13},
    }, max) == 4);
    assert(max == 5);
}
