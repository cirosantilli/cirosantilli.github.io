#!/usr/bin/env python

'''
By prayer-for-the-future-gods https://github.com/lucky-bai/projecteuler-solutions/issues/98. Runtime: 0m1.049s on pypy3 3.11.13, Ubuntu 25.10, Lenovo ThinkPad P14s.
'''

from itertools import combinations as K
m=10**9+7
p=2,3,5,7,11
h=((1,1,0,0,0),(1,0,1,0,0),(1,0,0,1,0),(1,0,0,0,1),(0,1,1,0,0),(0,1,0,1,0),(0,1,0,0,1),(0,0,1,1,0),(0,0,1,0,1),(0,0,0,1,1),(-1,0,0,0,0),(0,-1,0,0,0),(0,0,-1,0,0),(0,0,0,-1,0),(0,0,0,0,-1))
def d(M):
    if len(M)==1:return M[0][0]
    s=0
    r=M[0]
    for j,x in enumerate(r):
        if x:s+=(-1)**j*x*d([row[:j]+row[j+1:] for row in M[1:]])
    return s
def a(M):
    n=len(M)
    o=[[0]*n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            o[i][j]=(-1)**(i+j)*d([row[:i]+row[i+1:] for k,row in enumerate(M) if k!=j])
    return o
def w(v):
    z=1
    for q,e in zip(p,v):
        if e>=0:
            z=z*pow(q,e,m)%m
        else:
            z=z*pow(pow(q,-e,m),m-2,m)%m
    return z
x=[]
for I in K(range(15),5):
    b=[h[i] for i in I]
    det=d(b)
    if det in (1,-1,2,-2):
        adj=a(b)
        r=[]
        for i in range(5):
            v=[adj[j][i] for j in range(5)]
            if sum(b[i][k]*v[k] for k in range(5))>0:v=[-t for t in v]
            r.append(v)
        den=1
        for v in r:den=den*pow((1-w(v))%m,m-2,m)%m
        x.append((I,det,adj,r,den))
def f(v):
    z=1
    for q,e in zip(p,v):
        if e<0:return 0
        z=z*pow(q,e,m)%m
    return z
def P(L,s=1):
    b=L+[0]*5
    t=0
    for I,d,adj,r,den in x:
        bn=[b[i] for i in I]
        xn=[sum(adj[i][j]*bn[j] for j in range(5)) for i in range(5)]
        ok=True;eq=0
        if d>0:
            for idx,row in enumerate(h):
                v=sum(row[j]*xn[j] for j in range(5));u=b[idx]*d
                if v>u:ok=False;break
                eq+=v==u
        else:
            for idx,row in enumerate(h):
                v=sum(row[j]*xn[j] for j in range(5));u=b[idx]*d
                if v<u:ok=False;break
                eq+=v==u
        if not ok or (s and eq!=5):continue
        da=abs(d)
        if da==1:
            t=(t+f([x//d for x in xn])*den)%m
        else:
            dr=[[d*u for u in v] for v in r]
            tw=da*2
            num=0
            for mask in range(32):
                T=[x*2 for x in xn]
                for i in range(5):
                    if mask>>i&1:
                        Ri=dr[i]
                        for j in range(5):T[j]+=Ri[j]
                for j in range(5):
                    if T[j]%tw:break
                else:
                    exp=[T[j]//(2*d) for j in range(5)]
                    if all(sum(h[row][k]*exp[k] for k in range(5))<=b[row] for row in range(15)):
                        num=(num+f(exp))%m
            t=(t+num*den)%m
    return t
def B(n=1005):
    a=[0]*n;a[0]=1;a[1]=7
    for i in range(2,n):a[i]=(7*a[i-1]+a[i-2]*a[i-2])%m
    return a
def Q(A,n):return P(A[10*n:10*n+10])
def S(n=100):
    A=B(10*n+5);return sum(Q(A,i) for i in range(n))%m
if __name__=="__main__":
    assert P(list(range(1,11)))==799809376
    print(S())
