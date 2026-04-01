---
name: hexagonal-patterns
description: Hexagonal architecture dependency rules, code patterns (value objects, use cases, InMemory repos), and inside-out development order. Used by Coder, Planner, and Reviewer.
user-invocable: false
---

# Hexagonal Architecture Patterns

## Dependency rules (strict)

- Domain **never** imports from infrastructure or application
- Application **never** imports from infrastructure
- Infrastructure may import from domain and application
- Dependencies are injected, never instantiated directly
- These rules are validated with `eslint-plugin-hexagonal-architecture` and `ArchUnitTS`

## Development order (inside-out)

```
Domain (pure logic) → Use Case → InMemory Repository → Adapter/Controller
```

1. **Domain first**: If new entities or value objects are needed, the first task creates them with their tests
2. **Ports before adapters**: Define the interface (port/repository) before implementing the adapter
3. **InMemory before real**: InMemory repository is created alongside use case tests, before the real implementation
4. **Use cases as orchestrators**: Each use case coordinates domain + ports using Either/Maybe for errors
5. **Infrastructure last**: Controllers/UI, concrete repositories, and adapters come after domain and use cases

## Code patterns

### Value objects (immutable, validated at construction)

```typescript
import { Either } from '@/shared/domain/types/either'

export class Email {
  private constructor(private readonly value: string) {}

  static create(value: string): Either<InvalidEmailError, Email> {
    if (!Email.isValid(value)) return Either.left(new InvalidEmailError(value))
    return Either.right(new Email(value))
  }

  private static isValid(value: string): boolean { /* ... */ }
  equals(other: Email): boolean { return this.value === other.value }
  toString(): string { return this.value }
}
```

### Use cases (orchestrate with Either)

```typescript
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: CreateUserCommand): Promise<Either<CreateUserError, void>> {
    const emailOrError = Email.create(command.email)
    if (emailOrError.isLeft()) return Either.left(emailOrError.value)

    const user = User.create({ email: emailOrError.value, name: command.name })
    await this.userRepository.save(user)
    return Either.right(undefined)
  }
}
```

### Use case tests (with InMemory, sociable)

```typescript
describe('CreateUser', () => {
  // TODO: Case list
  // [x] should create user with valid data
  // [ ] should reject invalid email
  // [ ] should reject duplicate email

  it('should create user with valid data', async () => {
    const repository = new InMemoryUserRepository()
    const createUser = new CreateUser(repository)

    const result = await createUser.execute({
      email: 'user@example.com',
      name: 'John'
    })

    expect(result.isRight()).toBe(true)
    const saved = await repository.findByEmail(Email.create('user@example.com').value)
    expect(saved).toBeDefined()
  })
})
```

### InMemory repository

```typescript
export class InMemoryUserRepository implements UserRepository {
  private users: User[] = []

  async save(user: User): Promise<void> {
    this.users.push(user)
  }

  async findByEmail(email: Email): Promise<Maybe<User>> {
    const found = this.users.find(u => u.email.equals(email))
    return found ? Maybe.some(found) : Maybe.none()
  }
}
```

## Testing rules

- **Never** mock repositories in use case tests — use InMemory implementations
- **Never** mock domain classes. If you need to mock domain, the design has a problem
- Mocks are reserved exclusively for external services in infrastructure tests (third-party APIs, etc.)
- **Sociable** style (Fowler): test units with real collaborators when practical. Only infrastructure dependencies are isolated

## Naming conventions

- `Repository` is **exclusive** for persistence ports (e.g. `HealthRepository`)
- `Adapter` is used for **all other** port implementations (e.g. `HttpHealthRepository`, `StripePaymentAdapter`)
- Use cases: `[query/command]-[entity]-use-case.ts`
- Files: kebab-case (`query-health-use-case.ts`)
- Classes/Interfaces: PascalCase (`QueryHealthUseCase`)

## Error handling

- `Either<Error, Value>` — For operations that can fail with typed errors
- `Maybe<Value>` — For optional values (replaces `null`/`undefined`)
- Domain never throws exceptions for business flows. Exceptions are reserved for programming bugs
