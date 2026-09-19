import { validate } from './env.validation';

describe('validate (env config)', () => {
  it('throws a clear error when DATABASE_URL is missing', () => {
    expect(() => validate({})).toThrow(/DATABASE_URL/);
  });

  it('throws a clear error when DATABASE_URL is malformed', () => {
    expect(() => validate({ DATABASE_URL: 'not-a-valid-url' })).toThrow(
      /DATABASE_URL/,
    );
  });

  it('does not throw when DATABASE_URL is a valid postgres connection string', () => {
    expect(() =>
      validate({
        DATABASE_URL: 'postgresql://user:pass@localhost:5432/caltrack',
      }),
    ).not.toThrow();
  });
});
