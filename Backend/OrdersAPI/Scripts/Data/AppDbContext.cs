using Microsoft.EntityFrameworkCore;
using OrdersAPI.Scripts.Models;


namespace OrdersAPI.Scripts.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Order> Orders { get; set; }

        public override int SaveChanges()
        {
            foreach (var entry in ChangeTracker.Entries())
            {
                if (entry.State != EntityState.Added
                    && entry.State != EntityState.Modified)
                {
                    continue;
                }

                foreach (var property in entry.Properties)
                {
                    if (property.Metadata.ClrType != typeof(DateTime))
                    {
                        continue;
                    }

                    if (property.CurrentValue is DateTime dateTime)
                    {
                        property.CurrentValue = DateTime.SpecifyKind(dateTime, DateTimeKind.Utc);
                    }
                }
            }
            return base.SaveChanges();
        }
    }
}