# Database Setup for iFoundAnApple

This directory contains the SQL scripts needed to set up the database structure in Supabase.

## Setup Instructions

### 1. Create the userProfile Table

Run the SQL script `userProfile.sql` in your Supabase SQL Editor:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `userProfile.sql`
4. Click **Run** to execute the script

### 2. What the Script Creates

The `userProfile.sql` script creates:

- **`userProfile` table** with fields for extended user information
- **Row Level Security (RLS)** policies for data privacy
- **Indexes** for better performance
- **Triggers** for automatic timestamp updates
- **Proper permissions** for authenticated users

### 3. Table Structure

```sql
userProfile (
  id: UUID (Primary Key)
  user_id: UUID (References auth.users)
  bank_info: TEXT
  phone_number: VARCHAR(20)
  address: TEXT
  city: VARCHAR(100)
  country: VARCHAR(100)
  postal_code: VARCHAR(20)
  date_of_birth: DATE
  emergency_contact: TEXT
  preferences: JSONB
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
)
```

### 4. Security Features

- **RLS Enabled**: Users can only access their own profile data
- **Cascade Delete**: Profile data is automatically deleted when user account is deleted
- **Unique Constraint**: One profile per user
- **Automatic Timestamps**: `updated_at` is automatically updated on changes

### 5. Adding New Fields

To add new profile fields later:

1. **Add the column** to the `userProfile` table
2. **Update the TypeScript interface** in `types.ts`
3. **Update the ProfilePage component** to include the new field
4. **Update the `updateUserProfile` function** to handle the new field

### 6. Testing

After setup, you can test by:

1. Creating a user account
2. Going to the profile page
3. Adding bank information
4. Checking that data is saved in both:
   - Supabase Auth user metadata (fullName)
   - `userProfile` table (bankInfo and other fields)

### 7. Troubleshooting

If you encounter issues:

- **Check RLS policies** are properly set
- **Verify table permissions** for authenticated users
- **Check console logs** for any database errors
- **Ensure the table exists** in your Supabase schema

## Next Steps

Once the database is set up:

1. **Test the profile functionality** in the app
2. **Add more profile fields** as needed
3. **Implement additional profile features** (avatar upload, etc.)
4. **Add profile data validation** and error handling
