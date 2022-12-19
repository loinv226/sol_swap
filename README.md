# Use in localnet:

```
solana-test-validator --reset
```

- Keep runing validator and open other session and run

```
solana config set --url localhost
# check local keypair
solana address
# if not exist can generate new keypair
solana-keygen new
```

# Build and deploy

```
# compiles program
anchor build
# deploy compiled program
anchor deploy
```

# To test run

```
anchor run test
# or if already run manual at first time and not start localnet
anchor test
```
