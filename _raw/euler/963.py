#!/usr/bin/env python

'''
By prayer-for-the-future-gods https://github.com/lucky-bai/projecteuler-solutions/issues/98. Runtime: 0m17.496s on pypy3 3.11.13, Ubuntu 25.10, Lenovo ThinkPad P14s.
'''

from collections import Counter as C
from math import log,ceil

def F(N):
    m=1<<ceil(log(max(N,1),3))
    B=[0.0]*(m+1)
    for i in range(1,m+1):
        h=B[i>>1];B[i]=h+1 if i&1 else h/2 if h<2 else h-1
    R=[0]
    for n in range(1,N+1):
        s=''
        x=n
        while x:s=str(x%3)+s;x//=3
        if not s:s='0'
        l=-1
        for j,c in enumerate(s):
            if c=='1':break
            if c<'1':l=j
        L=[]
        if l>-1:
            k=0
            for c in s[:l][::-1]:
                if c<'1':k+=1
                else:L.append(k)
        u=''.join(c for c in s if c<'2')
        R.append((tuple(L),s.count('2')&1,B[int(u,2)] if u else 0.0))
    c=C(R[1:]);d=C()
    for a in c:
        for b in c:
            d[(tuple(sorted(a[0]+b[0])),a[1]^b[1],a[2]+b[2])]+=c[a]*(c[b]+(a==b))
    return sum(v*v for v in d.values())//4

if __name__ == '__main__':
    assert F(5) == 21
    print(F(10**5))
