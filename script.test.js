const { getNextDay, getNextBirthday } = require("./script");


global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
);

test('return date should be the next day', () => {
    const input = new Date ("2026-04-10T00:00:00");
    const result = getNextDay(input);
    expect(result).toBe('2026-04-11');
});

test('return birthday later this year if birthday has not passed', () => {
        const mockToday = new Date('2025-07-01T00:00:00');
        const friend = { birthday: "07/18"};
        const result = getNextBirthday(friend, new Date(mockToday));
        expect(result.toISOString().split('T')[0]).toBe('2025-07-18');
});

test('return birthday NEXT year if birthday has already passed', () => {
    const mockToday = new Date('2025-07-19T00:00:00');
    const friend = { birthday: '07/18' };
    const result = getNextBirthday(friend, new Date(mockToday));
    expect(result.toISOString().split('T')[0]).toBe('2026-07-18');
});
