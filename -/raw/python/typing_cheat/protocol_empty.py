from typing import Protocol

class CanFly(Protocol):
    def fly(self) -> None:
        raise NotImplementedError()

class Bird(CanFly):
    def fly(self):
        return None

class FakeBird(CanFly):
    pass

Bird().fly()
FakeBird().fly()
