
import pytest

def income_tax(salary):
    if salary <= 25000:
        return 0
    return round((salary - 25000) * 0.2, 2)

@pytest.mark.parametrize("salary, expected", [(20000, 0), (25000, 0), (40000, 3000)])
def test_income_tax(salary, expected):
    assert income_tax(salary) == expected
