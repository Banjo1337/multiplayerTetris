using Core.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace Api;

public static class ServiceExtensions
{
    public static void ConfigureIdentity(this IServiceCollection services)
    {
        var builder = services
            // .AddIdentity<User, IdentityRole>()
            .AddIdentityCore<User>(x =>
            {
                x.User.RequireUniqueEmail = true;
                x.Password.RequireDigit = true;
                x.Password.RequiredLength = 6;
                x.Password.RequireNonAlphanumeric = false;
                x.Password.RequireLowercase = false;
                x.Password.RequireUppercase = false;
            })
            .AddEntityFrameworkStores<TetrisContext>()
            .AddDefaultTokenProviders()
            .AddSignInManager<SignInManager<User>>()
            .AddUserManager<UserManager<User>>();

        builder.Services
            .AddAuthentication()
            .AddCookie("Identity.Application", opt =>
            {
                opt.Cookie.Name = "Identity.Application";
                opt.Cookie.SameSite = SameSiteMode.None;
            });
    //         .AddCookie(IdentityConstants.TwoFactorUserIdScheme, o =>
    // {
    //     o.Cookie.Name = IdentityConstants.TwoFactorUserIdScheme;
    //     o.ExpireTimeSpan = TimeSpan.FromMinutes(5);
    // }).AddExternalCookie();

        builder = new IdentityBuilder(builder.UserType, typeof(IdentityRole), services);
        // builder.AddEntityFrameworkStores<TetrisContext>().AddDefaultTokenProviders();
    }
}