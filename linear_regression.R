linear_reg_weights_or_sigma <- function(X, y, x_new, weights = NULL, sigma = NULL) {
  # X is a DESIGN matrix like (in principle it could have more columns)
  # [ 1 0.2
  # 1 0.7
  # 1 1.3
  # 1 1.5]
  # in principle it could have more colums for several  predictors, but we only need 1

  # yi = 1.a +  xi * b + ei
  # yi/sigmai = a/sigma i +   xi/ sigmi * b  + ei / sigma i
  # y' = a/sigma i +  xi' * b + ei'

  # and variance of ei' =ei/sigmai = 1!!

  # here we will consider     possibility of not only defining weights, but instead specifiying the SD of the error term (which is a special case of weights)

  if (!is.null(weights) & !is.null(sigma)) stop("At most one of weights and sigma can be specified")


  if (is.null(weights) & is.null(sigma)) {
    weights <- 1
    type <- "unweighted"
  } else if (is.null(weights)) {
    weights <- 1 / sigma^2
    type <- "sigma"
  } else {
    type <- "weighted"
  }


  weighted_X <- X * sqrt(weights)
  weighted_y <- y * sqrt(weights)

  #  print(t(weighted_X) %*% weighted_X)

  beta <- solve(t(weighted_X) %*% weighted_X) %*% t(weighted_X) %*% weighted_y

  # Calculate residuals
  residuals <- y - X %*% beta

  # Calculate the error variance
  if (!is.null(sigma)) {
    error_variance <- 1
  } else {
    error_variance <- sum(weights * residuals^2) / (length(y) - ncol(X))
  }

  # Calculate the covariance matrix for coefficients
  cov_matrix <- solve(t(weighted_X) %*% weighted_X) * error_variance

  # Calculate the standard errors for coefficients
  coefficients_error <- sqrt(diag(cov_matrix))

  x_new_design <- c(1, x_new)
  y_new <- x_new_design %*% beta

  var_y_new <- t(x_new_design) %*% cov_matrix %*% x_new_design

  ans <- data.frame(
    type = type,
    x = x_new, yhat = y_new, yhat_se = sqrt(var_y_new),
    alpha = beta[1], alpha_se = coefficients_error[1],
    beta = beta[2], beta_se = coefficients_error[2]
  )

  return(ans)
}





linear_reg_R <- function(x, y, x_new, weights = 1) {
  m1 <- lm(y ~ x, weights = weights)

  result <- summary(m1)$coeff

  alpha <- result[1, 1]
  alpha_se <- result[1, 2]
  beta <- result[2, 1]
  beta_se <- result[2, 2]

  type <- "lm R"

  prediction <- predict(m1, newdata = data.frame(x = x_new), se.fit = T)



  ans <- data.frame(
    type = type,
    x = x_new, yhat = prediction$fit, yhat_se = prediction$se.fit,
    alpha = alpha, alpha_se = alpha_se,
    beta = beta, beta_se = beta_se
  )


  return(ans)
}

x <- c(0, 1, 2, 3, 4)
y <- c(0.1, 2.2, 2.7, 3, 4)
sigma <- c(1, 1, 2, 2, 2)
x_new <- 5

X <- cbind(1, x)

y
X

result_set <- NULL

result_set <- rbind(
  result_set,
  linear_reg_weights_or_sigma(X, y, x_new, weights = 1 / sigma^2)
)

result_set <- rbind(
  result_set,
  linear_reg_R(x, y, x_new, weights = 1 / sigma^2)
)


result_set <- rbind(
  result_set,
  linear_reg_weights_or_sigma(X, y, x_new, sigma = sigma)
)

result_set
