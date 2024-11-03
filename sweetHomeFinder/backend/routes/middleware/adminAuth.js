
const adminAuth = async (req, res, next) => {
    try {
      const { clerkUserId } = req.query;
      if (!clerkUserId) {  
        return res.status(401).json({ message: 'No user ID provided' });
      }
  
      const result = await req.db.query(
        'SELECT is_admin FROM "Adopters" WHERE clerk_user_id = $1',
        [clerkUserId]
      );
  
      if (result.rows.length === 0 || !result.rows[0].is_admin) {
        return res.status(403).json({ message: 'Unauthorized: Admin access required' });
      }
  
      next();
    } catch (err) {
      console.error('Admin auth error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  module.exports = adminAuth;