import Model from 'app/model/Model'

describe('Model', () => {
  it('can fetch empty fields when model fields is not declared', () => {
    class User extends Model {
      static entity = 'users'
    }

    expect(User.fields()).toEqual({})
    expect((new User).$fields()).toEqual({})
  })

  it('should set default field values as a property on instanciation', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          name: this.attr('John Doe'),
          email: this.attr('john@example.com')
        }
      }
    }

    const user = new User()

    expect(user.name).toBe('John Doe')
    expect(user.email).toBe('john@example.com')
  })

  it('should set given field values as a property on instanciation', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          name: this.attr('John Doe'),
          email: this.attr('john@example.com')
        }
      }
    }

    const user = new User({ name: 'Jane Doe', age: 32 })

    expect(user.name).toBe('Jane Doe')
    expect(user.email).toBe('john@example.com')
    expect(user.age).toBe(undefined)
  })

  it('should mutate data if closure was given to the attr when instantiating', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          name: this.attr('', value => value.toUpperCase())
        }
      }
    }

    const user = new User({ name: 'john doe' })

    expect(user.name).toBe('JOHN DOE')
  })

  it('should mutate data if mutators are present', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          name: this.attr('')
        }
      }

      static mutators () {
        return {
          name (value) {
            return value.toUpperCase()
          }
        }
      }
    }

    const user = new User({ name: 'john doe' })

    expect(user.name).toBe('JOHN DOE')
  })

  it('attr mutator should take precedent over static mutators', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          name: this.attr('', value => value.toUpperCase())
        }
      }

      static mutators () {
        return {
          name (value) {
            return 'Not Expected'
          }
        }
      }
    }

    const user = new User({ name: 'john doe' })

    expect(user.name).toBe('JOHN DOE')
  })

  it('can make a new model instance', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }
    }

    const user = User.make({ id: 1, name: 'John Doe' })

    expect(user).toBeInstanceOf(User)
    expect(user.id).toBe(1)
    expect(user.name).toBe('John Doe')
  })

  it('can make a plain model record', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null)
        }
      }
    }

    const user = User.makePlain({ id: 1 })

    expect(user).not.toBeInstanceOf(User)
    expect(user.id).toBe(1)
  })

  it('can serialize own fields into json', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          name: this.attr('')
        }
      }
    }

    const data = { $id: 1, id: 1, name: 'John Doe' }

    const user = new User(data)

    expect(user.$toJson()).toEqual(data)
  })

  it('can get a value of the primary key', () => {
    class User extends Model {
      static fields () {
        return {
          id: this.attr(null)
        }
      }
    }

    const data = { id: 1 }

    expect(User.id(data)).toBe(1)
  })

  it('can get a value of the composit primary key', () => {
    class Vote extends Model {
      static primaryKey = ['vote_id', 'user_id']

      static fields () {
        return {
          vote_id: this.attr(null),
          user_id: this.attr(null)
        }
      }
    }

    const data = { user_id: 1, vote_id: 2 }

    expect(Vote.id(data)).toBe('2_1')
  })

  it('can get local key of the model', () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = ['name', 'email']

      static fields () {
        return {
          name: this.attr('John Doe'),
          email: this.attr('john@example.com')
        }
      }
    }

    expect(User.localKey()).toBe('id')
  })

  it('throws error when trying to fetch attribute class that does not exist', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          name: this.attr('John Doe'),
          email: this.attr('john@example.com')
        }
      }
    }

    expect(() => { User.getAttributeClass('blah') }).toThrow()
  })
})
